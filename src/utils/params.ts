import { badRequest } from "../lib/api-error.js";

export function getStringParam(value: string | string[] | undefined, name: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw badRequest("VALIDATION_ERROR", `Parametro ${name} invalido.`);
  }
  return value;
}
