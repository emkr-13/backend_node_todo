import { Request, Response } from "express";
import { getProfile, editUser } from "../../src/controllers/userController";
import { UserService } from "../../src/services/userService";
import { sendResponse } from "../../src/utils/responseHelper";
import logger from "../../src/utils/logger";

// Mock dependencies
jest.mock("../../src/services/userService");
jest.mock("../../src/utils/responseHelper");
jest.mock("../../src/utils/logger");

describe("User Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup request and response mocks
    mockRequest = {
      body: {},
    };

    // Mock user in request (added by auth middleware)
    (mockRequest as any).user = { id: 123 };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Setup UserService mock
    mockUserService = new UserService() as jest.Mocked<UserService>;
    (UserService as jest.Mock).mockImplementation(() => mockUserService);
  });

  describe("getProfile", () => {
    it("should get user profile successfully", async () => {
      // Arrange
      const mockUserProfile = {
        email: "test@example.com",
        fullname: "Test User",
        usercreated: new Date(),
      };
      mockUserService.getProfile.mockResolvedValue(mockUserProfile);

      // Act
      await getProfile(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserService.getProfile).toHaveBeenCalledWith(123);
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        200,
        "User profile retrieved successfully",
        mockUserProfile
      );
    });

    it("should return 400 if user is not authenticated", async () => {
      // Arrange
      (mockRequest as any).user = {};

      // Act
      await getProfile(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        400,
        "Unauthorized"
      );
      expect(mockUserService.getProfile).not.toHaveBeenCalled();
    });

    it("should return 404 if user profile not found", async () => {
      // Arrange
      mockUserService.getProfile.mockResolvedValue(null);

      // Act
      await getProfile(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserService.getProfile).toHaveBeenCalledWith(123);
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        404,
        "User not found"
      );
    });

    it("should handle errors when getting profile", async () => {
      // Arrange
      const error = new Error("Database error");
      mockUserService.getProfile.mockRejectedValue(error);

      // Act
      await getProfile(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserService.getProfile).toHaveBeenCalledWith(123);
      expect(logger.error).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        500,
        "Internal server error"
      );
    });
  });

  describe("editUser", () => {
    it("should update user successfully", async () => {
      // Arrange
      mockRequest.body = {
        fullname: "Updated Name",
        email: "updated@example.com",
      };
      mockUserService.updateUser.mockResolvedValue(true);

      // Act
      await editUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        123,
        mockRequest.body
      );
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        200,
        "User updated successfully"
      );
    });

    it("should return 400 if user is not authenticated", async () => {
      // Arrange
      (mockRequest as any).user = {};
      mockRequest.body = {
        fullname: "Updated Name",
      };

      // Act
      await editUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        400,
        "Unauthorized"
      );
      expect(mockUserService.updateUser).not.toHaveBeenCalled();
    });

    it("should return 404 if user not found", async () => {
      // Arrange
      mockRequest.body = {
        fullname: "Updated Name",
      };
      mockUserService.updateUser.mockResolvedValue(false);

      // Act
      await editUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        123,
        mockRequest.body
      );
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        404,
        "User not found"
      );
    });

    it("should handle errors during user update", async () => {
      // Arrange
      mockRequest.body = {
        fullname: "Updated Name",
      };
      const error = new Error("Database error");
      mockUserService.updateUser.mockRejectedValue(error);

      // Act
      await editUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        123,
        mockRequest.body
      );
      expect(logger.error).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        500,
        "Internal server error"
      );
    });
  });
});
