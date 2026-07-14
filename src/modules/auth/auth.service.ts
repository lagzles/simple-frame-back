import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { badRequest, conflict } from "../../lib/api-error.js";
import { hashToken, signAuthToken, TOKEN_TTL_SECONDS } from "../../utils/token.js";
import type { AuthCredentials } from "./auth.schemas.js";

export type AuthResult = {
  token: string;
  expiresInSeconds: number;
  user: {
    id: string;
    email: string;
  };
};

export async function register(credentials: AuthCredentials): Promise<AuthResult> {
  const passwordHash = await bcrypt.hash(credentials.password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        email: credentials.email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
      },
    });

    return createSession(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw conflict("EMAIL_ALREADY_EXISTS", "Email ja cadastrado.");
    }
    throw error;
  }
}

export async function login(credentials: AuthCredentials): Promise<AuthResult> {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user) {
    throw badRequest("INVALID_CREDENTIALS", "Email ou senha invalidos.");
  }

  const passwordMatches = await bcrypt.compare(credentials.password, user.passwordHash);
  if (!passwordMatches) {
    throw badRequest("INVALID_CREDENTIALS", "Email ou senha invalidos.");
  }

  return createSession({ id: user.id, email: user.email });
}

export async function logout(token: string | undefined): Promise<void> {
  if (!token) {
    return;
  }

  await prisma.authSession.updateMany({
    where: {
      tokenHash: hashToken(token),
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

async function createSession(user: { id: string; email: string }): Promise<AuthResult> {
  const token = signAuthToken({ sub: user.id, email: user.email });
  const expiresAt = new Date(Date.now() + TOKEN_TTL_SECONDS * 1000);

  await prisma.authSession.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt,
    },
  });

  return {
    token,
    expiresInSeconds: TOKEN_TTL_SECONDS,
    user,
  };
}
