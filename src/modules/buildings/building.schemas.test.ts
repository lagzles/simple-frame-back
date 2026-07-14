import { describe, expect, it } from "vitest";
import { createBuildingSchema } from "./building.schemas.js";

describe("createBuildingSchema", () => {
  it("accepts a valid building", () => {
    const result = createBuildingSchema.parse({
      name: "Galpao 01",
      frameSpacing: 6,
      frameCount: 10,
      freeHeight: 7,
      roofType: "double_slope",
      roofSlopePercent: 10,
    });

    expect(result.name).toBe("Galpao 01");
  });

  it("rejects invalid dimensions", () => {
    expect(() =>
      createBuildingSchema.parse({
        name: "Galpao 01",
        frameSpacing: 0,
        frameCount: 10,
        freeHeight: 7,
        roofType: "double_slope",
        roofSlopePercent: 10,
      }),
    ).toThrow();
  });
});
