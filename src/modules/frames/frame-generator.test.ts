import { describe, expect, it } from "vitest";
import { generateFrame } from "./frame-generator.js";

describe("generateFrame", () => {
  it("generates beams and steel columns", () => {
    const frame = generateFrame({
      name: "Portico tipo A",
      spanList: [12, 12],
      freeHeight: 7,
      ridgeX: 12,
      roofSlopePercent: 10,
      influenceWidth: 6,
      hasSteelColumns: true,
      roofType: "double_slope",
    });

    expect(frame.nodes.some((node) => node.supportType === "fixed")).toBe(true);
    expect(frame.members.filter((member) => member.memberType === "beam")).toHaveLength(2);
    expect(frame.members.filter((member) => member.memberType.includes("column"))).toHaveLength(3);
  });

  it("adds ridge point when ridge is inside a span", () => {
    const frame = generateFrame({
      name: "Portico tipo B",
      spanList: [10, 10],
      freeHeight: 7,
      ridgeX: 8,
      roofSlopePercent: 10,
      influenceWidth: 6,
      hasSteelColumns: false,
      roofType: "double_slope",
    });

    expect(frame.nodes.some((node) => node.x === 8)).toBe(true);
  });
});
