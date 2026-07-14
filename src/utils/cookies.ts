import type { CookieOptions, Response } from "express";
import { isProduction } from "../config/env.js";
import { AUTH_COOKIE_NAME, TOKEN_TTL_SECONDS } from "./token.js";

export function authCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: TOKEN_TTL_SECONDS * 1000,
    path: "/",
  };
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions());
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
  });
}
