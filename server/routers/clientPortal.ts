import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { clientPortalAccounts, assetProjects, assets, assetCategories } from "../../drizzle/schema";
import { eq, and, desc, sql, count } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Admin emails that can always view client dashboards
const ADMIN_EMAILS = [
  "kevin.runion@legacyassetintelligence.com",
  "chris.haynes@legacyassetintelligence.com",
];

function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

// Generate a random password
function generatePassword(length = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

// Generate a unique access token
function generateAccessToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export const clientPortalRouter = router({
  // ─── Create Client Dashboard (admin only) ──────────────────────────────────
  createDashboard: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        clientName: z.string().min(1),
        clientEmail: z.string().email().optional(),
        clientCompany: z.string().optional(),
        username: z.string().min(3).max(50),
        dashboardTitle: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!isAdmin(ctx.user?.email)) {
        throw new Error("Only admin staff can create client dashboards");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check username uniqueness
      const existing = await db
        .select({ id: clientPortalAccounts.id })
        .from(clientPortalAccounts)
        .where(eq(clientPortalAccounts.username, input.username))
        .limit(1);

      if (existing.length > 0) {
        throw new Error("Username already exists. Choose a different username.");
      }

      // Generate a generic password
      const plainPassword = generatePassword();
      const passwordHash = await bcrypt.hash(plainPassword, 10);
      const accessToken = generateAccessToken();

      const result = await db.insert(clientPortalAccounts).values({
        projectId: input.projectId,
        username: input.username,
        passwordHash,
        clientName: input.clientName,
        clientEmail: input.clientEmail || null,
        clientCompany: input.clientCompany || null,
        dashboardTitle: input.dashboardTitle || null,
        dashboardConfig: null,
        isActive: 1,
        accessToken,
        createdBy: ctx.user?.id || 0,
      });

      return {
        id: result[0].insertId,
        username: input.username,
        password: plainPassword, // Return plain password once for sharing
        accessToken,
        portalLink: `/client-portal?token=${accessToken}`, // Frontend will prepend origin
      };
    }),

  // ─── List all client dashboards (admin only) ───────────────────────────────
  listDashboards: protectedProcedure
    .input(z.object({ projectId: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      if (!isAdmin(ctx.user?.email)) {
        throw new Error("Only admin staff can view all client dashboards");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const conditions = input.projectId
        ? eq(clientPortalAccounts.projectId, input.projectId)
        : undefined;

      const accounts = await db
        .select()
        .from(clientPortalAccounts)
        .where(conditions)
        .orderBy(desc(clientPortalAccounts.createdAt));

      return accounts.map((a) => ({
        ...a,
        passwordHash: undefined, // Never expose hash
      }));
    }),

  // ─── Update client dashboard (admin only) ──────────────────────────────────
  updateDashboard: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        clientName: z.string().optional(),
        clientEmail: z.string().email().optional(),
        clientCompany: z.string().optional(),
        dashboardTitle: z.string().optional(),
        dashboardConfig: z.any().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!isAdmin(ctx.user?.email)) {
        throw new Error("Only admin staff can update client dashboards");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updates: any = {};
      if (input.clientName !== undefined) updates.clientName = input.clientName;
      if (input.clientEmail !== undefined) updates.clientEmail = input.clientEmail;
      if (input.clientCompany !== undefined) updates.clientCompany = input.clientCompany;
      if (input.dashboardTitle !== undefined) updates.dashboardTitle = input.dashboardTitle;
      if (input.dashboardConfig !== undefined) updates.dashboardConfig = input.dashboardConfig;
      if (input.isActive !== undefined) updates.isActive = input.isActive ? 1 : 0;

      if (Object.keys(updates).length > 0) {
        await db.update(clientPortalAccounts).set(updates).where(eq(clientPortalAccounts.id, input.id));
      }

      return { success: true };
    }),

  // ─── Reset client password (admin only) ────────────────────────────────────
  resetPassword: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdmin(ctx.user?.email)) {
        throw new Error("Only admin staff can reset client passwords");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const plainPassword = generatePassword();
      const passwordHash = await bcrypt.hash(plainPassword, 10);

      await db.update(clientPortalAccounts).set({ passwordHash }).where(eq(clientPortalAccounts.id, input.id));

      return { newPassword: plainPassword };
    }),

  // ─── Client Login (public) ─────────────────────────────────────────────────
  clientLogin: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [account] = await db
        .select()
        .from(clientPortalAccounts)
        .where(and(eq(clientPortalAccounts.username, input.username), eq(clientPortalAccounts.isActive, 1)))
        .limit(1);

      if (!account) {
        throw new Error("Invalid username or password");
      }

      const valid = await bcrypt.compare(input.password, account.passwordHash);
      if (!valid) {
        throw new Error("Invalid username or password");
      }

      // Update last login
      await db.update(clientPortalAccounts).set({ lastLogin: new Date() }).where(eq(clientPortalAccounts.id, account.id));

      return {
        success: true,
        accountId: account.id,
        accessToken: account.accessToken,
        clientName: account.clientName,
        dashboardTitle: account.dashboardTitle,
        projectId: account.projectId,
      };
    }),

  // ─── Client Login via Token (public) ───────────────────────────────────────
  loginByToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [account] = await db
        .select()
        .from(clientPortalAccounts)
        .where(and(eq(clientPortalAccounts.accessToken, input.token), eq(clientPortalAccounts.isActive, 1)))
        .limit(1);

      if (!account) return null;

      return {
        accountId: account.id,
        clientName: account.clientName,
        dashboardTitle: account.dashboardTitle,
        projectId: account.projectId,
        username: account.username,
      };
    }),

  // ─── Change client password (public — client self-service) ─────────────────
  changePassword: publicProcedure
    .input(
      z.object({
        username: z.string(),
        currentPassword: z.string(),
        newPassword: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [account] = await db
        .select()
        .from(clientPortalAccounts)
        .where(eq(clientPortalAccounts.username, input.username))
        .limit(1);

      if (!account) throw new Error("Account not found");

      const valid = await bcrypt.compare(input.currentPassword, account.passwordHash);
      if (!valid) throw new Error("Current password is incorrect");

      const newHash = await bcrypt.hash(input.newPassword, 10);
      await db.update(clientPortalAccounts).set({ passwordHash: newHash }).where(eq(clientPortalAccounts.id, account.id));

      return { success: true };
    }),

  // ─── Get client dashboard data (public — requires token or admin) ──────────
  getDashboardData: publicProcedure
    .input(
      z.object({
        projectId: z.number(),
        accessToken: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Admin override: Kevin and Chris can always view
      const userEmail = ctx.user?.email;
      const isAdminUser = isAdmin(userEmail);

      if (!isAdminUser) {
        // Verify access token
        if (!input.accessToken) throw new Error("Access denied");
        const [account] = await db
          .select()
          .from(clientPortalAccounts)
          .where(
            and(
              eq(clientPortalAccounts.projectId, input.projectId),
              eq(clientPortalAccounts.accessToken, input.accessToken),
              eq(clientPortalAccounts.isActive, 1)
            )
          )
          .limit(1);

        if (!account) throw new Error("Access denied");
      }

      // Get project info
      const [project] = await db
        .select()
        .from(assetProjects)
        .where(eq(assetProjects.id, input.projectId))
        .limit(1);

      if (!project) throw new Error("Project not found");

      // Get asset stats
      const [totalResult] = await db
        .select({ total: count() })
        .from(assets)
        .where(eq(assets.projectId, input.projectId));

      const [activeResult] = await db
        .select({ total: count() })
        .from(assets)
        .where(and(eq(assets.projectId, input.projectId), eq(assets.status, "active")));

      const [valueResult] = await db
        .select({ total: sql<string>`COALESCE(SUM(${assets.acquisitionCost}), 0)` })
        .from(assets)
        .where(eq(assets.projectId, input.projectId));

      // Get category breakdown
      const categoryBreakdown = await db
        .select({
          categoryId: assets.categoryId,
          count: count(),
        })
        .from(assets)
        .where(eq(assets.projectId, input.projectId))
        .groupBy(assets.categoryId);

      // Get status breakdown
      const statusBreakdown = await db
        .select({
          status: assets.status,
          count: count(),
        })
        .from(assets)
        .where(eq(assets.projectId, input.projectId))
        .groupBy(assets.status);

      // Get condition breakdown
      const conditionBreakdown = await db
        .select({
          condition: assets.condition,
          count: count(),
        })
        .from(assets)
        .where(eq(assets.projectId, input.projectId))
        .groupBy(assets.condition);

      // Get recent assets (last 10)
      const recentAssets = await db
        .select({
          id: assets.id,
          assetTag: assets.assetTag,
          name: assets.name,
          status: assets.status,
          condition: assets.condition,
          location: assets.location,
          department: assets.department,
          acquisitionCost: assets.acquisitionCost,
          createdAt: assets.createdAt,
        })
        .from(assets)
        .where(eq(assets.projectId, input.projectId))
        .orderBy(desc(assets.createdAt))
        .limit(10);

      return {
        project: {
          name: project.name,
          clientName: project.clientName,
          status: project.status,
          startDate: project.startDate,
          endDate: project.endDate,
          location: project.location,
          industry: project.industry,
        },
        stats: {
          totalAssets: totalResult?.total ?? 0,
          activeAssets: activeResult?.total ?? 0,
          totalValue: parseFloat(valueResult?.total || "0"),
        },
        categoryBreakdown,
        statusBreakdown,
        conditionBreakdown,
        recentAssets,
      };
    }),

  // ─── Admin: view any client dashboard (admin override) ─────────────────────
  adminViewDashboard: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!isAdmin(ctx.user?.email)) {
        throw new Error("Admin access required");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get the client portal account for this project
      const [account] = await db
        .select()
        .from(clientPortalAccounts)
        .where(eq(clientPortalAccounts.projectId, input.projectId))
        .limit(1);

      return account
        ? { ...account, passwordHash: undefined }
        : null;
    }),
});
