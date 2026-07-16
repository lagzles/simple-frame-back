import { prisma } from "../../lib/prisma.js";
import { notFound } from "../../lib/api-error.js";
import type { CreateModulationInput } from "./modulation.schemas.js";

export async function createModulation(userId: string, buildingId: string, input: CreateModulationInput) {
  const building = await prisma.building.findFirst({
    where: { id: buildingId, userId },
    select: { id: true },
  });

  if (!building) {
    throw notFound("Predio nao encontrado.");
  }

  return prisma.modulation.create({
    data: {
      buildingId,
      name: input.name,
      orderIndex: input.orderIndex,
      repeatCount: input.repeatCount,
      frameSpacing: input.frameSpacing,
    },
    include: {
      frames: {
        include: {
          nodes: true,
          members: true,
        },
      },
    },
  });
}

export async function listModulations(userId: string, buildingId: string) {
  const building = await prisma.building.findFirst({
    where: { id: buildingId, userId },
    select: { id: true },
  });

  if (!building) {
    throw notFound("Predio nao encontrado.");
  }

  return prisma.modulation.findMany({
    where: { buildingId },
    orderBy: [{ orderIndex: "asc" }, { updatedAt: "desc" }],
    include: {
      frames: {
        include: {
          nodes: true,
          members: true,
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });
}

export async function getModulation(userId: string, modulationId: string) {
  const modulation = await prisma.modulation.findFirst({
    where: {
      id: modulationId,
      building: { userId },
    },
    include: {
      frames: {
        include: {
          nodes: true,
          members: true,
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!modulation) {
    throw notFound("Modulacao nao encontrada.");
  }

  return modulation;
}
