import type { Frame, FrameNode, Member } from "@prisma/client";

export function presentFrameModel(model: { frame: Frame; nodes: FrameNode[]; members: Member[] }) {
  const nodeKeyById = new Map(model.nodes.map((node) => [node.id, node.nodeKey]));

  return {
    frameId: model.frame.id,
    name: model.frame.name,
    spanList: model.frame.spanListJson,
    freeHeight: model.frame.freeHeight,
    ridgeX: model.frame.ridgeX,
    roofSlopePercent: model.frame.roofSlopePercent,
    influenceWidth: model.frame.influenceWidth,
    minimumWebHeight: model.frame.minimumWebHeight,
    hasSteelColumns: model.frame.hasSteelColumns,
    roofType: model.frame.roofType,
    createdAt: model.frame.createdAt.toISOString(),
    updatedAt: model.frame.updatedAt.toISOString(),
    nodes: model.nodes.map((node) => ({
      key: node.nodeKey,
      x: node.x,
      y: node.y,
      supportType: node.supportType,
    })),
    members: model.members.map((member) => ({
      key: member.memberKey,
      startNodeKey: nodeKeyById.get(member.startNodeId),
      endNodeKey: nodeKeyById.get(member.endNodeId),
      type: member.memberType,
      length: member.length,
    })),
  };
}
