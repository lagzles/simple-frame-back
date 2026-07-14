import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const AUTH_COOKIE_NAME = "auth_token";
export const TOKEN_TTL_SECONDS = 60 * 60;

export type AuthTokenPayload = {
  sub: string;
  email: string;
};

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: TOKEN_TTL_SECONDS });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  const payload = jwt.verify(token, env.JWT_SECRET);
  if (typeof payload === "string" || typeof payload.sub !== "string" || typeof payload.email !== "string") {
    throw new Error("Invalid token payload");
  }
  return {
    sub: payload.sub,
    email: payload.email,
  };
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
