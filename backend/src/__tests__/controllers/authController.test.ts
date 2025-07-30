import { Request, Response } from "express";
import { getProfile, login, register } from "../../controllers/authController";

// Mock dependencies
jest.mock("../../config/database", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("../../config/auth", () => ({
  authenticateUser: jest.fn(),
  createUser: jest.fn(),
  generateToken: jest.fn(),
}));

// Import the mocked modules
import { authenticateUser, createUser, generateToken } from "../../config/auth";
import { prisma } from "../../config/database";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockAuthenticateUser = authenticateUser as jest.MockedFunction<
  typeof authenticateUser
>;
const mockCreateUser = createUser as jest.MockedFunction<typeof createUser>;
const mockGenerateToken = generateToken as jest.MockedFunction<
  typeof generateToken
>;

// Extend Request type to include user property
interface RequestWithUser extends Request {
  user?: any;
}

describe("Auth Controller", () => {
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

  describe("login", () => {
    it("should return 400 if email or password is missing", async () => {
      mockRequest = {
        body: { email: "test@example.com" }, // Missing password
      };

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Email and password are required",
      });
    });

    it("should return 400 if both email and password are missing", async () => {
      mockRequest = {
        body: {}, // Missing both email and password
      };

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Email and password are required",
      });
    });

    it("should return 401 for invalid credentials", async () => {
      mockAuthenticateUser.mockResolvedValue(null);

      mockRequest = {
        body: { email: "test@example.com", password: "wrongpassword" },
      };

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Invalid email or password",
      });
    });

    it("should return success response with token for valid credentials", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        role: "admin",
        password: "hashedpassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockToken = "mock-jwt-token";

      mockAuthenticateUser.mockResolvedValue(mockUser);
      mockGenerateToken.mockReturnValue(mockToken);

      mockRequest = {
        body: { email: "test@example.com", password: "correctpassword" },
      };

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        token: mockToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
    });

    it("should handle authentication errors", async () => {
      mockAuthenticateUser.mockRejectedValue(new Error("Database error"));

      mockRequest = {
        body: { email: "test@example.com", password: "password" },
      };

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("register", () => {
    it("should return 400 if email or password is missing", async () => {
      mockRequest = {
        body: { email: "test@example.com" }, // Missing password
      };

      await register(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Email and password are required",
      });
    });

    it("should return 400 if user already exists", async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        email: "test@example.com",
        role: "admin",
        password: "hashedpassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockRequest = {
        body: { email: "test@example.com", password: "password" },
      };

      await register(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "User with this email already exists",
      });
    });

    it("should create user successfully", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        role: "admin",
        password: "hashedpassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      mockCreateUser.mockResolvedValue(mockUser);

      mockRequest = {
        body: { email: "test@example.com", password: "password" },
      };

      await register(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "User created successfully",
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
    });

    it("should use default role when not provided", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        role: "admin",
        password: "hashedpassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      mockCreateUser.mockResolvedValue(mockUser);

      mockRequest = {
        body: { email: "test@example.com", password: "password" }, // No role specified
      };

      await register(mockRequest as Request, mockResponse as Response);

      expect(mockCreateUser).toHaveBeenCalledWith(
        "test@example.com",
        "password",
        "admin"
      );
    });

    it("should handle registration errors", async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      mockRequest = {
        body: { email: "test@example.com", password: "password" },
      };

      await register(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("getProfile", () => {
    it("should return user profile successfully", async () => {
      const mockUser = {
        userId: "1",
        email: "test@example.com",
        role: "admin",
      };

      mockRequest = {
        user: mockUser,
      };

      await getProfile(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        user: {
          id: mockUser.userId,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
    });

    it("should handle profile retrieval errors", async () => {
      mockRequest = {
        user: null, // Simulate missing user
      };

      await getProfile(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });
});
