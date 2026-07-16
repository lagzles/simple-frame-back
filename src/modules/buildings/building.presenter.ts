import type { Building, Modulation } from "@prisma/client";

type BuildingWithModulations = Building & {
  modulations?: Modulation[];
};

export function presentBuilding(building: BuildingWithModulations) {
  const modulations = building.modulations ?? [];

  return {
    id: building.id,
    name: building.name,
    roofSlopePercent: building.roofSlopePercent,
    modulationCount: modulations.length,
    modulations: modulations.map((modulation) => ({
      id: modulation.id,
      buildingId: modulation.buildingId,
      name: modulation.name,
      orderIndex: modulation.orderIndex,
      repeatCount: modulation.repeatCount,
      frameSpacing: modulation.frameSpacing,
      createdAt: modulation.createdAt.toISOString(),
      updatedAt: modulation.updatedAt.toISOString(),
      frames: [],
    })),
    createdAt: building.createdAt.toISOString(),
    updatedAt: building.updatedAt.toISOString(),
  };
}
