import { prisma } from "../../lib/prisma.js";
import type { CreateProjectInput } from "./project.schemas.js";

export async function listProjects(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createProject(userId: string, input: CreateProjectInput) {
  return prisma.project.create({
    data: {
      userId,
      name: input.name,
      clientName: input.clientName,
      description: input.description,
    },
  });
}
