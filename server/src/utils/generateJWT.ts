import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./constants";

export function generateAccessToken(id: string, role: string): string {
  try {
    const payload = { id, role };
    const options = { expiresIn: 86400 };
    return jwt.sign(payload, JWT_SECRET(), options);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export function generateRefreshToken(id: string, role: string): string {
  try {
    const payload = { id, role };
    const options = { expiresIn: 604800 };
    return jwt.sign(payload, JWT_SECRET(), options);
  } catch (error: any) {
    throw new Error(error.message);
  }
}
