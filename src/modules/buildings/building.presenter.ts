import type { Building } from "@prisma/client";

export function presentBuilding(building: Building) {
  return {
    id: building.id,
    name: building.name,
    frameSpacing: building.frameSpacing,
    frameCount: building.frameCount,
    freeHeight: building.freeHeight,
    roofType: building.roofType,
    roofSlopePercent: building.roofSlopePercent,
    createdAt: building.createdAt.toISOString(),
    updatedAt: building.updatedAt.toISOString(),
  };
}
