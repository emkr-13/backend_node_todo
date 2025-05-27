import { UserRepository } from "../repositories/userRepository";
import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
} from "../dto/userDto";
import bcrypt from "bcryptjs";
import { generateJwtToken, generateRefreshToken } from "../utils/helper";
import logger from "../utils/logger";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(registerData: RegisterRequestDto): Promise<boolean> {
    try {
      const { email, password, fullname } = registerData;

      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        return false;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      await this.userRepository.create({
        email,
        password: hashedPassword,
        fullname: fullname || null,
      });

      return true;
    } catch (error) {
      logger.error(
        { error, email: registerData.email },
        "Error in AuthService.register"
      );
      throw error;
    }
  }

  async login(loginData: LoginRequestDto): Promise<LoginResponseDto | null> {
    try {
      const { email, password } = loginData;

      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return null;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      // Generate tokens
      const jwtResponse = await generateJwtToken({ id: user.id });
      const refreshTokenResponse = await generateRefreshToken({ id: user.id });

      const authToken = jwtResponse.token ?? "";
      const refreshToken = refreshTokenResponse.token ?? "";

      if (!refreshToken) {
        logger.error({ userId: user.id }, "Refresh token generation failed");
        throw new Error("Refresh token generation failed");
      }

      // Update refresh token in database
      await this.userRepository.updateRefreshToken(
        user.id,
        refreshToken,
        new Date(Date.now() + parseInt(process.env.REFRESH_TOKEN_EXP!) * 1000)
      );

      return {
        token: authToken,
        refreshToken,
      };
    } catch (error) {
      logger.error(
        { error, email: loginData.email },
        "Error in AuthService.login"
      );
      throw error;
    }
  }

  async logout(userId: string): Promise<boolean> {
    try {
      await this.userRepository.updateRefreshToken(userId, null, null);
      return true;
    } catch (error) {
      logger.error({ error, userId }, "Error in AuthService.logout");
      throw error;
    }
  }
}
