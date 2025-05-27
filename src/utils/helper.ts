import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface JwtResponse {
  success: boolean;
  token?: string; // Token bersifat opsional karena hanya ada jika success = true
}


/**
 * Menghasilkan JWT token untuk autentikasi.
 * @param payload - Data yang akan disisipkan ke dalam token.
 * @returns Promise<JwtResponse> - Objek dengan status sukses dan token (jika berhasil).
 */
async function generateJwtToken(payload: object): Promise<JwtResponse> {
  try {
    const rawToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: parseInt(process.env.AUTH_TOKEN_EXP!, 10),
    });

    return {
      success: true,
      token: rawToken,
    };
  } catch (err) {
    return {
      success: false,
    };
  }
}

/**
 * Menghasilkan refresh token untuk autentikasi.
 * @param payload - Data yang akan disisipkan ke dalam token.
 * @returns Promise<JwtResponse> - Objek dengan status sukses dan token (jika berhasil).
 */
async function generateRefreshToken(payload: object): Promise<JwtResponse> {
  try {
    const rawToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: parseInt(process.env.REFRESH_TOKEN_EXP!, 10),
    });

    return {
      success: true,
      token: rawToken,
    };
  } catch (err) {
    return {
      success: false,
    };
  }
}

/**
 * Menghitung paginasi untuk halaman tertentu.
 * @param total - Total jumlah data.
 * @param pagenum - Halaman saat ini.
 * @param limit - Jumlah data per halaman.
 * @returns Promise<PaginationResponse> - Objek yang berisi detail paginasi.
 */


export {  generateJwtToken, generateRefreshToken,  };
