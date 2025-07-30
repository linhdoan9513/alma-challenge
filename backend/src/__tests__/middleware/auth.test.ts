import { NextFunction, Request, Response } from "express";
import { authenticateToken } from "../../middleware/auth";

// Mock dependencies
jest.mock("../../config/database", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("../../config/auth", () => ({
  verifyToken: jest.fn(),
}));

// Import the mocked modules
import { verifyToken } from "../../config/auth";
import { prisma } from "../../config/database";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>;

// Extend Request type to include user property
interface RequestWithUser extends Request {
  user?: any;
}

describe("Auth Middleware", () => {
  let mockRequest: Partial<RequestWithUser>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe("authenticateToken", () => {
    it("should return 401 if no token provided", () => {
      mockRequest = {
        headers: {},
      };

      authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Access token required",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 if token format is invalid", () => {
      mockRequest = {
        headers: {
          authorization: "InvalidToken",
        },
      };

      authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Access token required",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 403 if token is invalid", () => {
      const invalidToken = "invalid.jwt.token";

      // Mock verifyToken to return null for invalid token
      mockVerifyToken.mockReturnValue(null);

      mockRequest = {
        headers: {
          authorization: `Bearer ${invalidToken}`,
        },
      };

      authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid or expired token",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next() with user data if token is valid", async () => {
      const mockToken = "valid.jwt.token";
      const mockDecoded = {
        userId: "1",
        email: "test@example.com",
        role: "admin",
      };

      // Mock verifyToken to return a valid decoded token
      mockVerifyToken.mockReturnValue(mockDecoded);

      mockRequest = {
        headers: {
          authorization: `Bearer ${mockToken}`,
        },
      };

      authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect((mockRequest as any).user).toEqual(mockDecoded);
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});
