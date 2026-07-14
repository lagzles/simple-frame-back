import { prisma } from "../../lib/prisma.js";
import { notFound } from "../../lib/api-error.js";
import type { SaveLoadCasesInput } from "./load-case.schemas.js";
import { generateLoadCases } from "./load-case-generator.js";

export async function saveLoadCases(userId: string, frameId: string, input: SaveLoadCasesInput) {
  const frame = await prisma.frame.findFirst({
    where: {
      id: frameId,
      modulation: {
        building: {
          userId,
        },
      },
    },
    select: {
      id: true,
      roofType: true,
      influenceWidth: true,
    },
  });

  if (!frame) {
    throw notFound("Portico nao encontrado.");
  }

  const loadCases = generateLoadCases({
    roofType: frame.roofType,
    influenceWidth: frame.influenceWidth,
    cp: input.surfaceLoads.cp,
    sc: input.surfaceLoads.sc,
    su: input.surfaceLoads.su,
    cv: input.surfaceLoads.cv,
  });

  await prisma.$transaction([
    prisma.loadCase.deleteMany({ where: { frameId } }),
    prisma.loadCase.createMany({
      data: loadCases.map((loadCase) => ({
        frameId,
        ...loadCase,
      })),
    }),
  ]);

  return prisma.loadCase.findMany({
    where: { frameId },
    orderBy: { orderIndex: "asc" },
  });
}
