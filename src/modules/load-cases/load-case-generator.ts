import type { RoofType } from "@prisma/client";

export type GeneratedLoadCase = {
  caseKey: string;
  caseType: string;
  orderIndex: number;
  verticalLeft: number;
  verticalRight: number;
  horizontalLeft: number;
  horizontalRight: number;
};

export function generateLoadCases(input: {
  roofType: RoofType;
  influenceWidth: number;
  cp: number;
  sc: number;
  su: number;
  cv: number;
}): GeneratedLoadCase[] {
  const cpLinear = input.cp * input.influenceWidth;
  const scLinear = input.sc * input.influenceWidth;
  const suLinear = input.su * input.influenceWidth;
  const cvLinear = input.cv * input.influenceWidth;
  const influenceClosure = input.influenceWidth > 14 ? input.influenceWidth / 2 : input.influenceWidth;
  const cvClosure = input.cv * influenceClosure;

  const base: GeneratedLoadCase[] = [
    caseRow(0, "pp", "pp", 0, 0, 0, 0),
    caseRow(1, "cp", "cp", -cpLinear, -cpLinear, 0, 0),
    caseRow(2, "sc", "sc", -scLinear, -scLinear, 0, 0),
    caseRow(3, "su", "su", -suLinear, -suLinear, 0, 0),
  ];

  if (input.roofType === "double_slope") {
    return [
      ...base,
      caseRow(4, "cv 0", "wind", cvLinear, cvLinear, cvClosure, -cvClosure),
      caseRow(5, "cv 90 i", "wind", 0.53 * cvLinear, 0.1 * cvLinear, -1 * cvClosure, -0.2 * cvClosure),
      caseRow(6, "cv 90 ii", "wind", 1.03 * cvLinear, 0.6 * cvLinear, -0.5 * cvClosure, -0.7 * cvClosure),
      caseRow(7, "cv 270 i", "wind", 0.1 * cvLinear, 0.53 * cvLinear, 0.2 * cvClosure, cvClosure),
      caseRow(8, "cv 270 ii", "wind", 0.6 * cvLinear, 1.03 * cvLinear, 0.7 * cvClosure, 0.5 * cvClosure),
    ];
  }

  return [
    ...base,
    caseRow(4, "cv 0", "wind", 1.2 * cvLinear, 1.2 * cvLinear, cvClosure, -cvClosure),
    caseRow(5, "cv 90 i", "wind", 0.7 * cvLinear, 0.7 * cvLinear, -1 * cvClosure, -0.2 * cvClosure),
    caseRow(6, "cv 90 ii", "wind", 1.2 * cvLinear, 1.2 * cvLinear, -0.5 * cvClosure, -0.7 * cvClosure),
    caseRow(7, "cv 270 i", "wind", 0.7 * cvLinear, 0.7 * cvLinear, 0.2 * cvClosure, cvClosure),
    caseRow(8, "cv 270 ii", "wind", 1.2 * cvLinear, 1.2 * cvLinear, 0.7 * cvClosure, 0.5 * cvClosure),
  ];
}

function caseRow(
  orderIndex: number,
  caseKey: string,
  caseType: string,
  verticalLeft: number,
  verticalRight: number,
  horizontalLeft: number,
  horizontalRight: number,
): GeneratedLoadCase {
  return {
    orderIndex,
    caseKey,
    caseType,
    verticalLeft,
    verticalRight,
    horizontalLeft,
    horizontalRight,
  };
}
