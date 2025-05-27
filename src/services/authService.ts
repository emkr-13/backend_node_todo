import { UserRepository } from "../repositories/userRepository";
import { LoginRequestDto, LoginResponseDto } from "../dto/userDto";
import bcrypt from "bcryptjs";
import { generateJwtToken, generateRefreshToken } from "../utils/helper";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
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
      console.error("Error in AuthService.login:", error);
      throw error;
    }
  }

  async logout(userId: string): Promise<boolean> {
    try {
      await this.userRepository.updateRefreshToken(userId, null, null);
      return true;
    } catch (error) {
      console.error("Error in AuthService.logout:", error);
      throw error;
    }
  }
}
