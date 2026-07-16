import type { Frame, FrameNode, Member, Modulation } from "@prisma/client";
import { presentFrameModel } from "../frames/frame.presenter.js";

type FrameWithModel = Frame & {
  nodes?: FrameNode[];
  members?: Member[];
};

type ModulationWithFrames = Modulation & {
  frames?: FrameWithModel[];
};

export function presentModulation(modulation: ModulationWithFrames) {
  const frames = modulation.frames ?? [];

  return {
    id: modulation.id,
    buildingId: modulation.buildingId,
    name: modulation.name,
    orderIndex: modulation.orderIndex,
    repeatCount: modulation.repeatCount,
    frameSpacing: modulation.frameSpacing,
    createdAt: modulation.createdAt.toISOString(),
    updatedAt: modulation.updatedAt.toISOString(),
    frames: frames.map((frame) =>
      presentFrameModel({
        frame,
        nodes: frame.nodes ?? [],
        members: frame.members ?? [],
      }),
    ),
  };
}
