import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe(
  "leads.submitLead",
  () => {
    it(
      "accepts valid email and submits lead",
      async () => {
        const ctx = createPublicContext();
        const caller = appRouter.createCaller(ctx);
        const uniqueEmail = `test-${Date.now()}@company.com`;

        const result = await caller.leads.submitLead({
          email: uniqueEmail,
          firstName: "John",
          lastName: "Doe",
          company: "Acme Corp",
          message: "Interested in ghost asset recovery",
        });

        expect(result).toBeDefined();
        // Success OR contact already exists (409) is acceptable
        expect(result.success || result.error?.includes("409")).toBe(true);
      },
      { timeout: 15000 }
    );

    it(
      "rejects invalid email format",
      async () => {
        const ctx = createPublicContext();
        const caller = appRouter.createCaller(ctx);

        try {
          await caller.leads.submitLead({
            email: "not-an-email",
            company: "Test Corp",
          });
          expect.fail("Should have thrown validation error");
        } catch (error: any) {
          expect(error.code).toBe("BAD_REQUEST");
        }
      },
      { timeout: 5000 }
    );

    it(
      "requires email field",
      async () => {
        const ctx = createPublicContext();
        const caller = appRouter.createCaller(ctx);

        try {
          await caller.leads.submitLead({
            email: "",
            company: "Test Corp",
          });
          expect.fail("Should have thrown validation error");
        } catch (error: any) {
          expect(error.code).toBe("BAD_REQUEST");
        }
      },
      { timeout: 5000 }
    );

    it(
      "accepts optional fields",
      async () => {
        const ctx = createPublicContext();
        const caller = appRouter.createCaller(ctx);
        const uniqueEmail = `minimal-${Date.now()}@company.com`;

        const result = await caller.leads.submitLead({
          email: uniqueEmail,
        });

        // Success OR contact already exists (409) is acceptable
        expect(result.success || result.error?.includes("409")).toBe(true);
      },
      { timeout: 15000 }
    );
  },
  { timeout: 15000 }
);
