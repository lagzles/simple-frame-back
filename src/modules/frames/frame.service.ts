import { prisma } from "../../lib/prisma.js";
import { notFound } from "../../lib/api-error.js";
import type { FrameGenerateInput } from "./frame.schemas.js";
import { generateFrame } from "./frame-generator.js";

export async function generateAndSaveFrame(userId: string, modulationId: string, input: FrameGenerateInput) {
  const modulation = await prisma.modulation.findFirst({
    where: {
      id: modulationId,
      building: { userId },
    },
    select: { id: true },
  });

  if (!modulation) {
    throw notFound("Modulacao nao encontrada.");
  }

  const generated = generateFrame(input);

  return prisma.$transaction(async (tx) => {
    const frame = await tx.frame.create({
      data: {
        modulationId,
        name: input.name,
        spanListJson: input.spanList,
        freeHeight: input.freeHeight,
        ridgeX: input.ridgeX,
        roofSlopePercent: input.roofSlopePercent,
        influenceWidth: input.influenceWidth,
        minimumWebHeight: input.minimumWebHeight,
        hasSteelColumns: input.hasSteelColumns,
        roofType: input.roofType,
      },
    });

    const nodes = await Promise.all(
      generated.nodes.map((node, index) =>
        tx.frameNode.create({
          data: {
            frameId: frame.id,
            nodeKey: node.nodeKey,
            x: node.x,
            y: node.y,
            gx: index * 3 + 1,
            gy: index * 3 + 2,
            gz: index * 3 + 3,
            supportType: node.supportType,
          },
        }),
      ),
    );

    const nodeByKey = new Map(nodes.map((node) => [node.nodeKey, node]));

    const members = await Promise.all(
      generated.members.map((member) =>
        tx.member.create({
          data: {
            frameId: frame.id,
            memberKey: member.memberKey,
            startNodeId: nodeByKey.get(member.startNodeKey)!.id,
            endNodeId: nodeByKey.get(member.endNodeKey)!.id,
            memberType: member.memberType,
            kx: member.kx,
            ky: member.ky,
            length: member.length,
          },
        }),
      ),
    );

    return {
      frame,
      nodes,
      members,
    };
  });
}
