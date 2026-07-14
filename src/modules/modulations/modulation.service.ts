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
  });
}
