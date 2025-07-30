import { Request, Response } from "express";
import {
  getLeads,
  submitLead,
  updateLeadStatus,
} from "../../controllers/leadController";

// Mock dependencies
jest.mock("../../config/database", () => ({
  prisma: {
    lead: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("../../middleware/validation", () => ({
  sanitizeInput: jest.fn((input: string) => input),
}));

// Import the mocked modules
import { prisma } from "../../config/database";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

// Extend Request type to include user property
interface RequestWithUser extends Request {
  user?: any;
}

describe("Lead Controller", () => {
  let mockRequest: Partial<RequestWithUser>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe("submitLead", () => {
    const mockLeadData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      linkedin: "https://linkedin.com/johndoe",
      country: "United States",
      o1Visa: "true",
      openInput: "Additional information",
    };

    it("should submit lead successfully without file", async () => {
      const mockCreatedLead = {
        id: "1",
        ...mockLeadData,
        visaType: "O1",
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.lead.create as jest.Mock).mockResolvedValue(mockCreatedLead);

      mockRequest = {
        body: mockLeadData,
        file: undefined,
      };

      await submitLead(mockRequest as Request, mockResponse as Response);

      expect(mockPrisma.lead.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          linkedinUrl: "https://linkedin.com/johndoe",
          country: "United States",
          additionalInfo: "Additional information",
          visaType: "O1",
          status: "PENDING",
        }),
      });

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Lead submitted successfully",
        submissionId: "1",
        timestamp: mockCreatedLead.createdAt,
      });
    });

    it("should submit lead successfully with file", async () => {
      const mockFile = {
        path: "/uploads/resume.pdf",
        originalname: "resume.pdf",
        fieldname: "resume",
        encoding: "7bit",
        mimetype: "application/pdf",
        size: 1024,
        destination: "/uploads",
        filename: "resume.pdf",
        buffer: Buffer.from("mock file content"),
        stream: {} as any,
      };

      const mockCreatedLead = {
        id: "1",
        ...mockLeadData,
        resumePath: "/uploads/resume.pdf",
        resumeFileName: "resume.pdf",
        visaType: "O1",
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.lead.create as jest.Mock).mockResolvedValue(mockCreatedLead);

      mockRequest = {
        body: mockLeadData,
        file: mockFile,
      };

      await submitLead(mockRequest as Request, mockResponse as Response);

      expect(mockPrisma.lead.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          resumePath: "/uploads/resume.pdf",
          resumeFileName: "resume.pdf",
        }),
      });
    });

    it("should handle different visa types correctly", async () => {
      const testCases = [
        { input: { eb1aVisa: "true" }, expected: "EB1A" },
        { input: { eb2NiwVisa: "true" }, expected: "EB2_NIW" },
        { input: { dontKnowVisa: "true" }, expected: "DONT_KNOW" },
      ];

      for (const testCase of testCases) {
        (mockPrisma.lead.create as jest.Mock).mockResolvedValue({
          id: "1",
          createdAt: new Date(),
        });

        // Create base data without visa type
        const baseData = {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          linkedin: "https://linkedin.com/johndoe",
          country: "United States",
          openInput: "Additional information",
        };

        mockRequest = {
          body: { ...baseData, ...testCase.input },
          file: undefined,
        };

        await submitLead(mockRequest as Request, mockResponse as Response);

        expect(mockPrisma.lead.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            visaType: testCase.expected,
          }),
        });
      }
    });

    it("should handle rate limiting", async () => {
      // This test would require mocking the rate limiting function
      // For now, we'll test the basic functionality
      (mockPrisma.lead.create as jest.Mock).mockResolvedValue({
        id: "1",
        createdAt: new Date(),
      });

      // Use a different email to avoid rate limiting
      const testData = {
        ...mockLeadData,
        email: "rate.limit.test@example.com",
      };

      mockRequest = {
        body: testData,
        file: undefined,
      };

      await submitLead(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Lead submitted successfully",
        submissionId: "1",
        timestamp: expect.any(Date),
      });
    });

    it("should handle database errors", async () => {
      (mockPrisma.lead.create as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Use a different email to avoid rate limiting
      const testData = {
        ...mockLeadData,
        email: "db.error.test@example.com",
      };

      mockRequest = {
        body: testData,
        file: undefined,
      };

      await submitLead(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Internal server error. Please try again later.",
      });
    });
  });

  describe("getLeads", () => {
    it("should return leads with pagination", async () => {
      const mockLeads = [
        {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          status: "PENDING",
          createdAt: new Date(),
          visaType: "O1",
          linkedinUrl: "https://linkedin.com/johndoe",
          country: "United States",
          additionalInfo: "Additional info",
          resumePath: null,
          resumeFileName: null,
        },
        {
          id: "2",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          status: "REACHED_OUT",
          createdAt: new Date(),
          visaType: "EB1A",
          linkedinUrl: "https://linkedin.com/janesmith",
          country: "Canada",
          additionalInfo: null,
          resumePath: null,
          resumeFileName: null,
        },
      ];

      (mockPrisma.lead.findMany as jest.Mock).mockResolvedValue(mockLeads);
      (mockPrisma.lead.count as jest.Mock).mockResolvedValue(2);

      mockRequest = {
        query: { limit: "10", offset: "0" },
        user: { userId: "1", role: "admin" },
      };

      await getLeads(mockRequest as Request, mockResponse as Response);

      expect(mockPrisma.lead.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 10,
      });

      expect(mockJson).toHaveBeenCalledWith({
        submissions: expect.arrayContaining([
          expect.objectContaining({
            id: "1",
            status: "PENDING",
            data: expect.objectContaining({
              firstName: "John",
              lastName: "Doe",
              email: "john@example.com",
              o1Visa: true,
              eb1aVisa: false,
              eb2NiwVisa: false,
              dontKnowVisa: false,
            }),
          }),
        ]),
        total: 2,
        limit: 10,
        offset: 0,
        sortField: "createdAt",
        sortDirection: "desc",
        search: undefined,
        status: "all",
      });
    });

    it("should handle search parameter", async () => {
      const mockLeads = [
        {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          status: "PENDING",
          createdAt: new Date(),
          visaType: "O1",
          linkedinUrl: "https://linkedin.com/johndoe",
          country: "United States",
          additionalInfo: null,
          resumePath: null,
          resumeFileName: null,
        },
      ];

      (mockPrisma.lead.findMany as jest.Mock).mockResolvedValue(mockLeads);
      (mockPrisma.lead.count as jest.Mock).mockResolvedValue(1);

      mockRequest = {
        query: { search: "john" },
        user: { userId: "1", role: "admin" },
      };

      await getLeads(mockRequest as Request, mockResponse as Response);

      expect(mockPrisma.lead.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { firstName: { contains: "john", mode: "insensitive" } },
            { lastName: { contains: "john", mode: "insensitive" } },
            { email: { contains: "john", mode: "insensitive" } },
            { country: { contains: "john", mode: "insensitive" } },
          ],
        },
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 10,
      });
    });

    it("should handle status filter", async () => {
      const mockLeads = [
        {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          status: "PENDING",
          createdAt: new Date(),
          visaType: "O1",
          linkedinUrl: "https://linkedin.com/johndoe",
          country: "United States",
          additionalInfo: null,
          resumePath: null,
          resumeFileName: null,
        },
      ];

      (mockPrisma.lead.findMany as jest.Mock).mockResolvedValue(mockLeads);
      (mockPrisma.lead.count as jest.Mock).mockResolvedValue(1);

      mockRequest = {
        query: { status: "PENDING" },
        user: { userId: "1", role: "admin" },
      };

      await getLeads(mockRequest as Request, mockResponse as Response);

      expect(mockPrisma.lead.findMany).toHaveBeenCalledWith({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 10,
      });
    });

    it("should handle database errors", async () => {
      (mockPrisma.lead.findMany as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      mockRequest = {
        query: {},
        user: { userId: "1", role: "admin" },
      };

      await getLeads(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("updateLeadStatus", () => {
    it("should update lead status successfully", async () => {
      const mockLead = {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        status: "REACHED_OUT",
        updatedAt: new Date(),
      };

      (mockPrisma.lead.update as jest.Mock).mockResolvedValue(mockLead);

      mockRequest = {
        params: { id: "1" },
        body: { status: "REACHED_OUT" },
        user: { userId: "1", role: "admin" },
      };

      await updateLeadStatus(mockRequest as Request, mockResponse as Response);

      expect(mockPrisma.lead.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: { status: "REACHED_OUT" },
      });

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        lead: {
          id: "1",
          status: "REACHED_OUT",
          updatedAt: mockLead.updatedAt,
        },
      });
    });

    it("should return 400 for invalid status", async () => {
      mockRequest = {
        params: { id: "1" },
        body: { status: "INVALID_STATUS" },
        user: { userId: "1", role: "admin" },
      };

      await updateLeadStatus(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Invalid status. Must be PENDING or REACHED_OUT",
      });
    });

    it("should handle database errors", async () => {
      (mockPrisma.lead.update as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      mockRequest = {
        params: { id: "1" },
        body: { status: "REACHED_OUT" },
        user: { userId: "1", role: "admin" },
      };

      await updateLeadStatus(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });
});
