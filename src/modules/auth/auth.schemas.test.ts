import { describe, expect, it } from "vitest";
import { authCredentialsSchema } from "./auth.schemas.js";

describe("authCredentialsSchema", () => {
  it("normalizes email", () => {
    const result = authCredentialsSchema.parse({
      email: "USER@EMAIL.COM",
      password: "senha123",
    });

    expect(result.email).toBe("user@email.com");
  });

  it("rejects weak password", () => {
    expect(() =>
      authCredentialsSchema.parse({
        email: "user@email.com",
        password: "123",
      }),
    ).toThrow();
  });
});
