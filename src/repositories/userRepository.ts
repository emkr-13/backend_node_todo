import { db } from "../config/db";
import { users } from "../models/user";
import { eq } from "drizzle-orm";
import { UserDto, UserUpdateDto } from "../dto/userDto";

export class UserRepository {
  async findById(userId: string): Promise<any> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user;
  }

  async findByEmail(email: string): Promise<any> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async update(userId: string, userData: Partial<UserUpdateDto>): Promise<any> {
    return await db.update(users).set(userData).where(eq(users.id, userId));
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
    expiry: Date | null
  ): Promise<any> {
    return await db
      .update(users)
      .set({
        refreshToken,
        refreshTokenExp: expiry,
      })
      .where(eq(users.id, userId));
  }
}
