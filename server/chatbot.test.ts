import { describe, it, expect, beforeAll } from "vitest";
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

describe("Chatbot Integration", () => {
  let caller: any;

  beforeAll(() => {
    const ctx = createPublicContext();
    caller = appRouter.createCaller(ctx);
  });

  it("sends a message and receives a response", async () => {
    const response = await caller.chatbot.sendMessage({
      message: "What is a ghost asset?",
      conversationHistory: [],
    });

    expect(response.success).toBe(true);
    expect(response.message).toBeTruthy();
    expect(response.message.length).toBeGreaterThan(0);
  }, { timeout: 30000 });

  it("extracts email from conversation and submits lead", async () => {
    const response = await caller.chatbot.sendMessage({
      message: "I'm interested in learning more. My email is test-chatbot-" + Date.now() + "@example.com",
      conversationHistory: [],
    });

    expect(response.success).toBe(true);
    expect(response.leadSubmitted).toBe(true);
    expect(response.leadEmail).toMatch(/^test-chatbot-\d+@example\.com$/);
  }, { timeout: 30000 });

  it("maintains conversation history", async () => {
    const message1 = await caller.chatbot.sendMessage({
      message: "What is LAI?",
      conversationHistory: [],
    });

    expect(message1.success).toBe(true);

    const message2 = await caller.chatbot.sendMessage({
      message: "Tell me more about the services",
      conversationHistory: [
        { role: "user", content: "What is LAI?" },
        { role: "assistant", content: message1.message },
      ],
    });

    expect(message2.success).toBe(true);
    expect(message2.message).toBeTruthy();
  }, { timeout: 30000 });

  it("handles empty message gracefully", async () => {
    try {
      await caller.chatbot.sendMessage({
        message: "",
        conversationHistory: [],
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("cannot be empty");
    }
  });
});
