import { sendResponse } from "../utils/responseHelper";
import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { UserUpdateDto, userUpdateSchema } from "../dto/userDto";
import logger from "../utils/logger";

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
      logger.info({ userId }, "User profile not found");
      sendResponse(res, 404, "User not found");
      return;
    }

    // Send response with user data
    logger.info({ userId }, "User profile retrieved successfully");
    sendResponse(res, 200, "User profile retrieved successfully", userProfile);
  } catch (error) {
    logger.error(
      { error, userId: (req as any)?.user?.id },
      "Error retrieving profile"
    );
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

    const userData: UserUpdateDto = req.body;
    const success = await userService.updateUser(userId, userData);

    // If user not found
    if (!success) {
      logger.info({ userId }, "User not found for update");
      sendResponse(res, 404, "User not found");
      return;
    }

    // Send success response
    logger.info({ userId, userData }, "User updated successfully");
    sendResponse(res, 200, "User updated successfully");
  } catch (error) {
    logger.error(
      { error, userId: (req as any)?.user?.id },
      "Error editing user"
    );
    sendResponse(res, 500, "Internal server error");
  }
};
