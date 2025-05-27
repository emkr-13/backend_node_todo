import { z } from "zod";

// Zod schemas
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullname: z.string().nullable(),
  createdAt: z.date().nullable(),
});

export const userProfileSchema = z.object({
  email: z.string().email(),
  fullname: z.string().nullable(),
  usercreated: z.date().nullable(),
});

export const userUpdateSchema = z.object({
  fullname: z.string().min(1, "Fullname is required"),
});

export const loginRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
});

export const registerRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullname: z.string().optional(),
});

// Types derived from Zod schemas
export type UserDto = z.infer<typeof userSchema>;
export type UserProfileDto = z.infer<typeof userProfileSchema>;
export type UserUpdateDto = z.infer<typeof userUpdateSchema>;
export type LoginRequestDto = z.infer<typeof loginRequestSchema>;
export type LoginResponseDto = z.infer<typeof loginResponseSchema>;
export type RegisterRequestDto = z.infer<typeof registerRequestSchema>;
