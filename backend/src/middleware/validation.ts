import { NextFunction, Request, Response } from 'express';

export function validateLeadSubmission(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { firstName, lastName, email, linkedin, country } = req.body;

  // Check required fields
  if (!firstName || !lastName || !email || !linkedin || !country) {
    res.status(400).json({
      error:
        'Missing required fields: firstName, lastName, email, linkedin, country',
    });
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  // Validate LinkedIn URL
  try {
    new URL(linkedin);
  } catch {
    res.status(400).json({
      error: 'Please provide a valid LinkedIn or website URL',
    });
    return;
  }

  // Validate field lengths
  if (firstName.length > 50) {
    res.status(400).json({ error: 'First name is too long' });
    return;
  }

  if (lastName.length > 50) {
    res.status(400).json({ error: 'Last name is too long' });
    return;
  }

  if (req.body.openInput && req.body.openInput.length > 1000) {
    res.status(400).json({
      error: 'Additional information is too long (max 1000 characters)',
    });
    return;
  }

  // Validate that at least one visa category is selected
  const hasVisa =
    req.body.o1Visa === 'true' || req.body.o1Visa === true ||
    req.body.eb1aVisa === 'true' || req.body.eb1aVisa === true ||
    req.body.eb2NiwVisa === 'true' || req.body.eb2NiwVisa === true ||
    req.body.dontKnowVisa === 'true' || req.body.dontKnowVisa === true;
  if (!hasVisa) {
    res.status(400).json({
      error: 'Please select at least one visa category',
    });
    return;
  }

  next();
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}
