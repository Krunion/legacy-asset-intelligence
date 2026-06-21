import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
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
      ctx.res.clearCookie("session", { ...cookieOptions, maxAge: -1 });
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
        // Send notification emails to both team members
        const emailResult = await sendContactNotificationEmails({
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          company: input.company,
          message: input.message,
        });

        // Return result
        return {
          success: emailResult.success,
          error: emailResult.error,
        };
      }),

    notifyCalculatorUsage: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          industry: z.string(),
          assetCount: z.number(),
          locations: z.number(),
          departments: z.number(),
          estimatedRecovery: z.number(),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Send notification emails about calculator usage
        const emailResult = await sendContactNotificationEmails({
          email: input.email,
          message: `ROI Calculator Used - Industry: ${input.industry}, Assets: ${input.assetCount}, Locations: ${input.locations}, Departments: ${input.departments}, Estimated Recovery: $${input.estimatedRecovery.toLocaleString()}${input.message ? `\n\nAdditional Info: ${input.message}` : ''}`,
        });

        return {
          success: emailResult.success,
          error: emailResult.error,
        };
      }),
  }),

  chatbot: chatbotRouter,
});

export type AppRouter = typeof appRouter;
