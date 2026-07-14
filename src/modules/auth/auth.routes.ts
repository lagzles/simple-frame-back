import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { clearAuthCookie, setAuthCookie } from "../../utils/cookies.js";
import { authCredentialsSchema } from "./auth.schemas.js";
import * as authService from "./auth.service.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const credentials = authCredentialsSchema.parse(req.body);
    const result = await authService.register(credentials);
    setAuthCookie(res, result.token);
    res.status(201).json({
      user: result.user,
      expiresInSeconds: result.expiresInSeconds,
    });
  }),
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const credentials = authCredentialsSchema.parse(req.body);
    const result = await authService.login(credentials);
    setAuthCookie(res, result.token);
    res.json({
      user: result.user,
      expiresInSeconds: result.expiresInSeconds,
    });
  }),
);

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

authRouter.post(
  "/logout",
  requireAuth,
  asyncHandler(async (req, res) => {
    await authService.logout(req.authToken);
    clearAuthCookie(res);
    res.json({ ok: true });
  }),
);
