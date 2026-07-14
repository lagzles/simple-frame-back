import type { Frame, FrameNode, Member } from "@prisma/client";

export function presentFrameModel(model: { frame: Frame; nodes: FrameNode[]; members: Member[] }) {
  const nodeKeyById = new Map(model.nodes.map((node) => [node.id, node.nodeKey]));

  return {
    frameId: model.frame.id,
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
