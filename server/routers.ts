import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { sendContactNotificationEmails } from "./_core/emailNotification";
import { chatbotRouter } from "./routers/chatbot";
import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getDb } from "./db";
import { videos } from "../drizzle/schema";
import { eq } from "drizzle-orm";

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
        // Send notification emails to both team members
        console.log("[Contact Form] Received submission from:", input.email);
        const emailResult = await sendContactNotificationEmails(
          {
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            phone: input.phone,
            company: input.company,
            message: input.message,
          },
          "contact_form"
        );

        console.log("[Contact Form] Email result:", emailResult);
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
        console.log("[ROI Calculator] Received submission from:", input.email);
        const emailResult = await sendContactNotificationEmails(
          {
            email: input.email,
            message: `ROI Calculator Used - Industry: ${input.industry}, Assets: ${input.assetCount}, Locations: ${input.locations}, Departments: ${input.departments}, Estimated Recovery: $${input.estimatedRecovery.toLocaleString()}${input.message ? `\n\nAdditional Info: ${input.message}` : ''}`,
          },
          "roi_calculator"
        );

        console.log("[ROI Calculator] Email result:", emailResult);
        return {
          success: emailResult.success,
          error: emailResult.error,
        };
      }),
  }),

  chatbot: chatbotRouter,

  videos: router({
    getByPhase: publicProcedure
      .input(z.object({ phaseNumber: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;
        const result = await db.select().from(videos).where(eq(videos.phaseNumber, input.phaseNumber)).limit(1);
        return result.length > 0 ? result[0] : null;
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;
        const result = await db.select().from(videos).where(eq(videos.id, input.id)).limit(1);
        return result.length > 0 ? result[0] : null;
      }),
  }),
});

export type AppRouter = typeof appRouter;
