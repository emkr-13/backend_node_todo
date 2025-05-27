import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import { AuthService } from "../services/authService";
import { LoginRequestDto, RegisterRequestDto } from "../dto/userDto";
import logger from "../utils/logger";

const authService = new AuthService();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullname } = req.body;

    // Validate input
    if (!email || !password) {
      sendResponse(res, 400, "Email and password are required");
      return;
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      sendResponse(res, 400, "Invalid email format");
      return;
    }

    // Check password length
    if (password.length < 6) {
      sendResponse(res, 400, "Password must be at least 6 characters");
      return;
    }

    const registerData: RegisterRequestDto = { email, password, fullname };
    const success = await authService.register(registerData);

    if (!success) {
      logger.info({ email }, "Registration failed - Email already in use");
      sendResponse(res, 409, "Email already in use");
      return;
    }

    logger.info({ email }, "User registered successfully");
    sendResponse(res, 201, "User registered successfully");
  } catch (error) {
    logger.error({ error }, "Error during registration");
    sendResponse(res, 500, "Registration failed", error);
  }
};

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
      logger.info({ email }, "Login failed - Invalid credentials");
      sendResponse(res, 401, "Invalid credentials");
      return;
    }

    logger.info({ email }, "Login successful");
    sendResponse(res, 200, "Login successful", {
      token: result.token,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    logger.error(
      { error, email: req.body.email },
      "Unexpected error during login"
    );
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
      logger.error({ userId }, "Logout failed");
      sendResponse(res, 500, "Logout failed");
      return;
    }

    logger.info({ userId }, "Logout successful");
    sendResponse(res, 200, "Logout successful");
  } catch (error) {
    logger.error(
      { error, userId: (req as any)?.user?.id },
      "Error during logout"
    );
    sendResponse(res, 500, "Logout failed", error);
  }
};
