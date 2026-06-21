import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { submitLeadToHubSpot } from "./_core/hubspot";
import { sendContactNotificationEmails } from "./_core/emailNotification";
import { chatbotRouter } from "./routers/chatbot";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  leads: router({
    submitLead: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          phone: z.string().optional(),
          company: z.string().optional(),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Submit to HubSpot
        const hubspotResult = await submitLeadToHubSpot({
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          company: input.company,
          message: input.message,
        });

        // Send notification emails to both team members
        const emailResult = await sendContactNotificationEmails({
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          company: input.company,
          message: input.message,
        });

        // Return combined result
        return {
          success: hubspotResult.success && emailResult.success,
          contactId: hubspotResult.contactId,
          error: hubspotResult.error || emailResult.error,
        };
      }),
  }),

  chatbot: chatbotRouter,
});

export type AppRouter = typeof appRouter;
