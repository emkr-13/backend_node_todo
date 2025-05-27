import { UserRepository } from "../repositories/userRepository";
import { UserProfileDto, UserUpdateDto } from "../dto/userDto";
import logger from "../utils/logger";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getProfile(userId: string): Promise<UserProfileDto | null> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return null;
      }

      return {
        email: user.email,
        fullname: user.fullname,
        usercreated: user.createdAt,
      };
    } catch (error) {
      logger.error({ error, userId }, "Error in UserService.getProfile");
      throw error;
    }
  }

  async updateUser(userId: string, userData: UserUpdateDto): Promise<boolean> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return false;
      }

      await this.userRepository.update(userId, userData);
      return true;
    } catch (error) {
      logger.error(
        { error, userId, userData },
        "Error in UserService.updateUser"
      );
      throw error;
    }
  }
}
