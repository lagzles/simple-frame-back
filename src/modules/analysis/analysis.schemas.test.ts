import { describe, expect, it } from "vitest";
import { createAnalysisJobSchema } from "./analysis.schemas.js";

describe("createAnalysisJobSchema", () => {
  it("fills default options", () => {
    const result = createAnalysisJobSchema.parse({
      buildingId: "4f24509f-2e6b-48db-ae92-ddc56eecb08d",
    });

    expect(result.options.runChecks).toBe(true);
    expect(result.options.optimizeProfiles).toBe(false);
  });
});
