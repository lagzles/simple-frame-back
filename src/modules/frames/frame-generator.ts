import type { FrameGenerateInput } from "./frame.schemas.js";

type GeneratedNode = {
  nodeKey: string;
  x: number;
  y: number;
  supportType: "none" | "fixed" | "pinned" | "roller" | "simple";
};

type GeneratedMember = {
  memberKey: string;
  startNodeKey: string;
  endNodeKey: string;
  memberType: "beam" | "column" | "external_column";
  kx: number;
  ky: number;
  length: number;
};

export type GeneratedFrame = {
  nodes: GeneratedNode[];
  members: GeneratedMember[];
};

export function generateFrame(input: FrameGenerateInput): GeneratedFrame {
  const width = sum(input.spanList);
  const ridgeX = input.roofType === "double_slope" ? input.ridgeX ?? width / 2 : undefined;
  const slope = input.roofSlopePercent / 100;
  const supportXs = cumulativeXs(input.spanList);
  const topXs = uniqueSorted(ridgeX && !supportXs.includes(ridgeX) ? [...supportXs, ridgeX] : supportXs);

  const nodes: GeneratedNode[] = [];
  const members: GeneratedMember[] = [];
  const topNodeByX = new Map<number, string>();
  const baseNodeByX = new Map<number, string>();
  let nodeIndex = 1;
  let memberIndex = 1;

  for (const x of topXs) {
    const key = `N${nodeIndex++}`;
    nodes.push({
      nodeKey: key,
      x,
      y: roofY(x, input.freeHeight, slope, width, input.roofType, ridgeX),
      supportType: input.hasSteelColumns ? "none" : supportXs.includes(x) ? (x === 0 ? "pinned" : "simple") : "none",
    });
    topNodeByX.set(x, key);
  }

  if (input.hasSteelColumns) {
    for (const x of supportXs) {
      const key = `N${nodeIndex++}`;
      const isExternal = x === 0 || x === width;
      nodes.push({
        nodeKey: key,
        x,
        y: 0,
        supportType: isExternal ? "fixed" : "pinned",
      });
      baseNodeByX.set(x, key);
    }
  }

  for (let i = 0; i < topXs.length - 1; i += 1) {
    const startX = topXs[i]!;
    const endX = topXs[i + 1]!;
    const startKey = topNodeByX.get(startX)!;
    const endKey = topNodeByX.get(endX)!;
    const dx = endX - startX;
    const dy = roofY(endX, input.freeHeight, slope, width, input.roofType, ridgeX) - roofY(startX, input.freeHeight, slope, width, input.roofType, ridgeX);
    members.push({
      memberKey: `M${memberIndex++}`,
      startNodeKey: startKey,
      endNodeKey: endKey,
      memberType: "beam",
      kx: 1,
      ky: 2.2 / dx,
      length: Math.hypot(dx, dy),
    });
  }

  if (input.hasSteelColumns) {
    for (const x of supportXs) {
      const baseKey = baseNodeByX.get(x)!;
      const topKey = topNodeByX.get(x)!;
      const height = roofY(x, input.freeHeight, slope, width, input.roofType, ridgeX);
      const isExternal = x === 0 || x === width;
      members.push({
        memberKey: `M${memberIndex++}`,
        startNodeKey: baseKey,
        endNodeKey: topKey,
        memberType: isExternal ? "external_column" : "column",
        kx: 1,
        ky: isExternal ? 3 / height : 1,
        length: height,
      });
    }
  }

  return { nodes, members };
}

function cumulativeXs(spans: number[]): number[] {
  const xs = [0];
  let acc = 0;
  for (const span of spans) {
    acc += span;
    xs.push(acc);
  }
  return xs;
}

function roofY(
  x: number,
  freeHeight: number,
  slope: number,
  width: number,
  roofType: "single_slope" | "double_slope",
  ridgeX?: number,
): number {
  if (roofType === "single_slope") {
    return freeHeight + x * slope;
  }

  const ridge = ridgeX ?? width / 2;
  const ridgeY = freeHeight + ridge * slope;
  return x <= ridge ? freeHeight + x * slope : ridgeY - (x - ridge) * slope;
}

function uniqueSorted(values: number[]): number[] {
  return [...new Set(values)].sort((a, b) => a - b);
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}
