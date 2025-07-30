import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { sanitizeInput } from '../middleware/validation';

// Simple in-memory rate limiting (in production, use Redis or similar)
const submissionAttempts = new Map<
  string,
  { count: number; lastAttempt: number }
>();

function isRateLimited(email: string): boolean {
  const now = Date.now();
  const attempts = submissionAttempts.get(email);

  if (!attempts) {
    submissionAttempts.set(email, { count: 1, lastAttempt: now });
    return false;
  }

  // Reset counter if more than 1 hour has passed
  if (now - attempts.lastAttempt > 60 * 60 * 1000) {
    submissionAttempts.set(email, { count: 1, lastAttempt: now });
    return false;
  }

  // Allow max 5 submissions per hour
  if (attempts.count >= 5) {
    return true;
  }

  attempts.count++;
  attempts.lastAttempt = now;
  return false;
}

export const submitLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;

    // Check rate limiting based on email
    if (isRateLimited(body.email)) {
      res.status(429).json({
        error:
          'Too many submission attempts from this email. Please try again later.',
      });
      return;
    }

    // Sanitize inputs
    const sanitizedData = {
      firstName: sanitizeInput(body.firstName),
      lastName: sanitizeInput(body.lastName),
      email: sanitizeInput(body.email).toLowerCase(),
      linkedinUrl: sanitizeInput(body.linkedin),
      country: sanitizeInput(body.country),
      additionalInfo: body.openInput
        ? sanitizeInput(body.openInput)
        : undefined,
      o1Visa: body.o1Visa || false,
      eb1aVisa: body.eb1aVisa || false,
      eb2NiwVisa: body.eb2NiwVisa || false,
      dontKnowVisa: body.dontKnowVisa || false,
      status: 'PENDING',
    };

    // Save to database
    const lead = await prisma.lead.create({
      data: sanitizedData,
    });

    console.log('Lead submission received:', lead);

    // Mock email sending
    console.log(`Sending confirmation email to: ${sanitizedData.email}`);
    console.log(
      `Email content: Thank you ${sanitizedData.firstName} ${sanitizedData.lastName} for your submission...`
    );

    // Mock CRM integration
    console.log(
      `Creating lead in CRM for: ${sanitizedData.firstName} ${sanitizedData.lastName}`
    );

    res.json({
      success: true,
      message: 'Lead submitted successfully',
      submissionId: lead.id,
      timestamp: lead.createdAt,
    });
  } catch (error) {
    console.error('Error processing lead submission:', error);
    res.status(500).json({
      error: 'Internal server error. Please try again later.',
    });
  }
};

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const search = req.query.search as string;
    const status = req.query.status as string;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    // Query database with pagination
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ]);

    // Transform data to match expected format
    const submissions = leads.map(lead => ({
      id: lead.id,
      timestamp: lead.createdAt.toISOString(),
      data: {
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        linkedin: lead.linkedinUrl,
        country: lead.country,
        o1Visa: lead.o1Visa,
        eb1aVisa: lead.eb1aVisa,
        eb2NiwVisa: lead.eb2NiwVisa,
        dontKnowVisa: lead.dontKnowVisa,
        openInput: lead.additionalInfo,
      },
      status: lead.status,
    }));

    res.json({
      submissions,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const updateLeadStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'REACHED_OUT'].includes(status)) {
      res.status(400).json({
        error: 'Invalid status. Must be PENDING or REACHED_OUT',
      });
      return;
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: { status },
    });

    res.json({
      success: true,
      lead: {
        id: lead.id,
        status: lead.status,
        updatedAt: lead.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};
