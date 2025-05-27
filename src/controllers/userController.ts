import { sendResponse } from "../utils/responseHelper";
import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { UserUpdateDto } from "../dto/userDto";

const userService = new UserService();

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.id; // Get user ID from token

    if (!userId) {
      sendResponse(res, 400, "Unauthorized");
      return;
    }

    const userProfile = await userService.getProfile(userId);

    // If user not found
    if (!userProfile) {
      sendResponse(res, 404, "User not found");
      return;
    }

    // Send response with user data
    sendResponse(res, 200, "User profile retrieved successfully", userProfile);
  } catch (error) {
    console.error("Error retrieving profile:", error);
    sendResponse(res, 500, "Internal server error");
  }
};

export const editUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    if (!userId) {
      sendResponse(res, 400, "Unauthorized");
      return;
    }

    const { fullname } = req.body;

    // Validate input
    if (!fullname) {
      sendResponse(res, 400, "Username is required");
      return;
    }

    const userData: UserUpdateDto = { fullname };
    const success = await userService.updateUser(userId, userData);

    // If user not found
    if (!success) {
      sendResponse(res, 404, "User not found");
      return;
    }

    // Send success response
    sendResponse(res, 200, "User updated successfully");
  } catch (error) {
    console.error("Error editing user:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
