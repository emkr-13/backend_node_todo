import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import { AuthService } from "../services/authService";
import { LoginRequestDto } from "../dto/userDto";

const authService = new AuthService();

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const { email, password } = req.body;

    if (!email || !password) {
      sendResponse(res, 400, "Email and password are required");
      return;
    }

    const loginData: LoginRequestDto = { email, password };
    const result = await authService.login(loginData);

    // If login failed
    if (!result) {
      sendResponse(res, 401, "Invalid credentials");
      return;
    }

    sendResponse(res, 200, "Login successful", {
      token: result.token,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    console.error("Unexpected error during login:", error);
    sendResponse(res, 500, "An unexpected error occurred", error);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user ID from request (from authenticate middleware)
    const userId = (req as any).user.id;

    if (!userId) {
      sendResponse(res, 400, "Unauthorized");
      return;
    }

    const success = await authService.logout(userId);

    if (!success) {
      sendResponse(res, 500, "Logout failed");
      return;
    }

    sendResponse(res, 200, "Logout successful");
  } catch (error) {
    console.error("Error during logout:", error);
    sendResponse(res, 500, "Logout failed", error);
  }
};
