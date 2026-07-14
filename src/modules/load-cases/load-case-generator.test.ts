import { describe, expect, it } from "vitest";
import { generateLoadCases } from "./load-case-generator.js";

describe("generateLoadCases", () => {
  it("preserves the expected load case order", () => {
    const cases = generateLoadCases({
      roofType: "double_slope",
      influenceWidth: 6,
      cp: 25,
      sc: 15,
      su: 10,
      cv: 40,
    });

    expect(cases.map((loadCase) => loadCase.caseKey)).toEqual([
      "pp",
      "cp",
      "sc",
      "su",
      "cv 0",
      "cv 90 i",
      "cv 90 ii",
      "cv 270 i",
      "cv 270 ii",
    ]);
  });

  it("converts surface load to linear load by influence width", () => {
    const cases = generateLoadCases({
      roofType: "single_slope",
      influenceWidth: 6,
      cp: 25,
      sc: 15,
      su: 10,
      cv: 40,
    });

    expect(cases.find((loadCase) => loadCase.caseKey === "cp")?.verticalLeft).toBe(-150);
  });
});
