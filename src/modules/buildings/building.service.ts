import type { Building } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { notFound } from "../../lib/api-error.js";
import type { CreateBuildingInput } from "./building.schemas.js";

export async function listBuildings(userId: string): Promise<Building[]> {
  try{
    const buildings = await prisma.building.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        modulations: true,
      },
    });
    return buildings;
  }catch(error){
    console.error("Error listing buildings", error);
    throw new Error("Error listing buildings");
  }
}

export async function createBuilding(userId: string, input: CreateBuildingInput): Promise<Building> {
  if (input.projectId) {
    const project = await prisma.project.findFirst({
      where: {
        id: input.projectId,
        userId,
      },
      select: { id: true },
    });

    if (!project) {
      throw notFound("Projeto nao encontrado.");
    }
  }

  return prisma.building.create({
    data: {
      userId,
      projectId: input.projectId,
      name: input.name,
      roofSlopePercent: input.roofSlopePercent,
    },
  });
}

export async function getOwnedBuilding(userId: string, buildingId: string): Promise<Building> {
  const building = await prisma.building.findFirst({
    where: {
      id: buildingId,
      userId,
    },
  });

  if (!building) {
    throw notFound("Predio nao encontrado.");
  }

  return building;
}
