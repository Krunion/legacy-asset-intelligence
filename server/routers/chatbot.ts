import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { submitLeadToHubSpot } from "../_core/hubspot";

const CHATBOT_SYSTEM_PROMPT = `You are a helpful AI assistant for Legacy Asset Intelligence, a specialized consulting firm that helps organizations recover capital from ghost assets (fixed assets that exist on the books but don't physically exist).

Your role is to:
1. Answer questions about ghost assets, asset management, and capital recovery
2. Explain the LAI three-phase methodology (Investigation, Platform Integration, Governance)
3. Help visitors understand their potential capital recovery
4. Be professional, concise, and focused on business value
5. When appropriate, suggest scheduling a discovery call

Key facts about LAI:
- Typical organizations have 15-30% ghost assets
- Ghost assets consume 25% of IT and operational budgets
- Global fixed asset management market: $264.7B (2023), growing at 28.3% CAGR
- LAI's three-phase approach: Physical audit + tagging → Technology platform → Recurring governance
- Average client ROI: 3.2x in Year 1

If the user provides their email or company name during conversation, acknowledge it and let them know you'll connect them with the team.

Keep responses concise (2-3 sentences max) and conversational.`;

export const chatbotRouter = router({
  sendMessage: publicProcedure
    .input(
      z.object({
        message: z.string().min(1, "Message cannot be empty"),
        conversationHistory: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        ).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Build message history for LLM
        const messages = [
          { role: "system" as const, content: CHATBOT_SYSTEM_PROMPT },
          ...(input.conversationHistory || []).map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          })),
          { role: "user" as const, content: input.message },
        ];

        // Call LLM
        const response = await invokeLLM({
          messages,
          maxTokens: 500,
        });

        const messageContent = response.choices[0]?.message?.content;
        let assistantMessage = "I'm having trouble responding. Please try again.";
        
        if (typeof messageContent === "string") {
          assistantMessage = messageContent;
        } else if (Array.isArray(messageContent)) {
          // Extract text from content array
          const textParts = messageContent
            .filter((part: any) => part.type === "text")
            .map((part: any) => part.text)
            .join(" ");
          assistantMessage = textParts || "I'm having trouble responding. Please try again.";
        }

        // Extract potential email/company from user message for lead capture
        const emailMatch = input.message.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
        const companyMatch = input.message.match(/(?:at|from|work at|company|organization)\s+([A-Za-z\s&]+?)(?:\.|,|$)/i);

        let leadSubmitted = false;
        if (emailMatch) {
          const email = emailMatch[0];
          const company = companyMatch ? companyMatch[1].trim() : undefined;

          // Submit lead to HubSpot
          const leadResult = await submitLeadToHubSpot({
            email,
            company,
            message: `Chatbot conversation: ${input.message}`,
          });

          if (leadResult.success) {
            leadSubmitted = true;
            console.log(`[Chatbot] Lead captured from conversation: ${email}`);
          }
        }

        return {
          success: true,
          message: assistantMessage,
          leadSubmitted,
          leadEmail: emailMatch?.[0],
        };
      } catch (error) {
        console.error("[Chatbot] Error:", error);
        return {
          success: false,
          message: "I encountered an error processing your message. Please try again.",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),
});
