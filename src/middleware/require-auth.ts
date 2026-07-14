import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { unauthorized } from "../lib/api-error.js";
import { AUTH_COOKIE_NAME, hashToken, verifyAuthToken } from "../utils/token.js";

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.[AUTH_COOKIE_NAME];
    if (!token || typeof token !== "string") {
      throw unauthorized();
    }

    const payload = verifyAuthToken(token);
    const tokenHash = hashToken(token);

    const session = await prisma.authSession.findFirst({
      where: {
        userId: payload.sub,
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!session) {
      throw unauthorized("Sessao expirada ou invalida.");
    }

    req.user = session.user;
    req.authToken = token;
    next();
  } catch {
    next(unauthorized("Sessao expirada ou invalida."));
  }
}
