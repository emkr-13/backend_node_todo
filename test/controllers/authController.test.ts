import { Request, Response } from "express";
import { register, login, logout } from "../../src/controllers/authController";
import { AuthService } from "../../src/services/authService";
import { sendResponse } from "../../src/utils/responseHelper";
import logger from "../../src/utils/logger";

// Mock dependencies
jest.mock("../../src/services/authService");
jest.mock("../../src/utils/responseHelper");
jest.mock("../../src/utils/logger");

describe("Auth Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup request and response mocks
    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Setup AuthService mock
    mockAuthService = new AuthService() as jest.Mocked<AuthService>;
    (AuthService as jest.Mock).mockImplementation(() => mockAuthService);
  });

  describe("register", () => {
    it("should register a user successfully", async () => {
      // Arrange
      mockRequest.body = {
        email: "test@example.com",
        password: "password123",
        fullname: "Test User",
      };
      mockAuthService.register.mockResolvedValue(true);

      // Act
      await register(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockAuthService.register).toHaveBeenCalledWith(mockRequest.body);
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        201,
        "User registered successfully"
      );
    });

    it("should return 409 if email is already in use", async () => {
      // Arrange
      mockRequest.body = {
        email: "existing@example.com",
        password: "password123",
        fullname: "Test User",
      };
      mockAuthService.register.mockResolvedValue(false);

      // Act
      await register(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockAuthService.register).toHaveBeenCalledWith(mockRequest.body);
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        409,
        "Email already in use"
      );
    });

    it("should handle errors during registration", async () => {
      // Arrange
      mockRequest.body = {
        email: "test@example.com",
        password: "password123",
        fullname: "Test User",
      };
      const error = new Error("Database error");
      mockAuthService.register.mockRejectedValue(error);

      // Act
      await register(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockAuthService.register).toHaveBeenCalledWith(mockRequest.body);
      expect(logger.error).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        500,
        "Registration failed",
        error
      );
    });
  });

  describe("login", () => {
    it("should login a user successfully", async () => {
      // Arrange
      mockRequest.body = {
        email: "test@example.com",
        password: "password123",
      };
      const mockLoginResult = {
        token: "mock-token",
        refreshToken: "mock-refresh-token",
      };
      mockAuthService.login.mockResolvedValue(mockLoginResult);

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockAuthService.login).toHaveBeenCalledWith(mockRequest.body);
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        200,
        "Login successful",
        {
          token: mockLoginResult.token,
          refreshToken: mockLoginResult.refreshToken,
        }
      );
    });

    it("should return 401 for invalid credentials", async () => {
      // Arrange
      mockRequest.body = {
        email: "wrong@example.com",
        password: "wrongpassword",
      };
      mockAuthService.login.mockResolvedValue(null);

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockAuthService.login).toHaveBeenCalledWith(mockRequest.body);
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        401,
        "Invalid credentials"
      );
    });

    it("should handle errors during login", async () => {
      // Arrange
      mockRequest.body = {
        email: "test@example.com",
        password: "password123",
      };
      const error = new Error("Database error");
      mockAuthService.login.mockRejectedValue(error);

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockAuthService.login).toHaveBeenCalledWith(mockRequest.body);
      expect(logger.error).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        500,
        "An unexpected error occurred",
        error
      );
    });
  });

  describe("logout", () => {
    it("should logout a user successfully", async () => {
      // Arrange
      (mockRequest as any).user = { id: 123 };
      mockAuthService.logout.mockResolvedValue(true);

      // Act
      await logout(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockAuthService.logout).toHaveBeenCalledWith(123);
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        200,
        "Logout successful"
      );
    });

    it("should return 400 if user is not authenticated", async () => {
      // Arrange
      (mockRequest as any).user = {};

      // Act
      await logout(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        400,
        "Unauthorized"
      );
      expect(mockAuthService.logout).not.toHaveBeenCalled();
    });

    it("should return 500 if logout fails", async () => {
      // Arrange
      (mockRequest as any).user = { id: 123 };
      mockAuthService.logout.mockResolvedValue(false);

      // Act
      await logout(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockAuthService.logout).toHaveBeenCalledWith(123);
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        500,
        "Logout failed"
      );
    });

    it("should handle errors during logout", async () => {
      // Arrange
      (mockRequest as any).user = { id: 123 };
      const error = new Error("Database error");
      mockAuthService.logout.mockRejectedValue(error);

      // Act
      await logout(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockAuthService.logout).toHaveBeenCalledWith(123);
      expect(logger.error).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        500,
        "Logout failed",
        error
      );
    });
  });
});
