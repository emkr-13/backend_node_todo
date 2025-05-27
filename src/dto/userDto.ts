export interface UserDto {
  id: string;
  email: string;
  fullname: string | null;
  createdAt: Date | null;
}

export interface UserProfileDto {
  email: string;
  fullname: string | null;
  usercreated: Date | null;
}

export interface UserUpdateDto {
  fullname: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  refreshToken: string;
}
