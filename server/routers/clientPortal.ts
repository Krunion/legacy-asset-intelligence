import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { clientPortalAccounts, assetProjects, assets, assetCategories, projectPhases, projectKpis, financialRecovery, riskExceptions, clientActionItems, projectReports, projectMeetings, projectBilling, projectDocuments } from "../../drizzle/schema";
import { eq, and, desc, sql, count } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Admin emails that can always view client dashboards
const ADMIN_EMAILS = [
  "kevin.runion@legacyassetintelligence.com",
  "krunion84@gmail.com",
  "chris.haynes@legacyassetintelligence.com",
];
function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
function isAdminUser(user: { email?: string | null; role?: string | null } | null | undefined): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return isAdmin(user.email);
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
      if (!isAdminUser(ctx.user)) {
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
      if (!isAdminUser(ctx.user)) {
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
      if (!isAdminUser(ctx.user)) {
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
      if (!isAdminUser(ctx.user)) {
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

      // Admin override: admins can always view
      const isAdminAccess = isAdmin(ctx.user?.email) || ctx.user?.role === "admin";

      if (!isAdminAccess) {
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

      // Get location breakdown
      const locationBreakdown = await db
        .select({
          location: assets.location,
          count: count(),
        })
        .from(assets)
        .where(eq(assets.projectId, input.projectId))
        .groupBy(assets.location);

      // Get department breakdown
      const departmentBreakdown = await db
        .select({
          department: assets.department,
          count: count(),
        })
        .from(assets)
        .where(eq(assets.projectId, input.projectId))
        .groupBy(assets.department);

      // Get recent assets (last 20)
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
        .limit(20);

      // Get project phases
      const phases = await db
        .select()
        .from(projectPhases)
        .where(eq(projectPhases.projectId, input.projectId))
        .orderBy(projectPhases.phaseNumber);

      // Get KPIs
      const [kpis] = await db
        .select()
        .from(projectKpis)
        .where(eq(projectKpis.projectId, input.projectId))
        .limit(1);

      // Get financial recovery items (only client-visible)
      const allRecoveryItems = await db
        .select()
        .from(financialRecovery)
        .where(eq(financialRecovery.projectId, input.projectId))
        .orderBy(desc(financialRecovery.amount));
      const recoveryItems = allRecoveryItems.filter(r => r.isClientVisible === 1);

      // Get risk exceptions (only client-visible)
      const allRisks = await db
        .select()
        .from(riskExceptions)
        .where(eq(riskExceptions.projectId, input.projectId))
        .orderBy(riskExceptions.riskLevel);
      const risks = allRisks.filter(r => r.isClientVisible === 1);

      // Get action items
      const actionItems = await db
        .select()
        .from(clientActionItems)
        .where(eq(clientActionItems.projectId, input.projectId))
        .orderBy(desc(clientActionItems.createdAt));

      // Get reports
      const reports = await db
        .select()
        .from(projectReports)
        .where(eq(projectReports.projectId, input.projectId))
        .orderBy(desc(projectReports.createdAt));

      // Get meetings (only client-visible)
      const allMeetings = await db
        .select()
        .from(projectMeetings)
        .where(eq(projectMeetings.projectId, input.projectId))
        .orderBy(desc(projectMeetings.scheduledDate));
      const meetings = allMeetings.filter(m => m.isClientVisible === 1);

      // Get billing (ONLY show client-visible items)
      const allBilling = await db
        .select()
        .from(projectBilling)
        .where(eq(projectBilling.projectId, input.projectId))
        .orderBy(desc(projectBilling.createdAt));
      const billing = allBilling.filter(b => b.isClientVisible === 1);
      // Get client-visible project documents
      const allDocuments = await db
        .select()
        .from(projectDocuments)
        .where(eq(projectDocuments.projectId, input.projectId))
        .orderBy(desc(projectDocuments.createdAt));
      const documents = allDocuments.filter(d => d.isClientVisible === 1);

      // Calculate financial totals
      const totalRecovery = recoveryItems.reduce((sum, item) => sum + parseFloat(item.amount || "0"), 0);
      const realizedRecovery = recoveryItems.filter(i => i.status === "realized").reduce((sum, item) => sum + parseFloat(item.amount || "0"), 0);
      const pendingRecovery = recoveryItems.filter(i => ["identified", "under_investigation", "awaiting_validation", "approved", "in_progress"].includes(i.status)).reduce((sum, item) => sum + parseFloat(item.amount || "0"), 0);

      return {
        project: {
          name: project.name,
          clientName: project.clientName,
          status: project.status,
          startDate: project.startDate,
          endDate: project.endDate,
          location: project.location,
          industry: project.industry,
          projectManager: project.projectManager,
          estimatedBudget: project.estimatedBudget,
        },
        stats: {
          totalAssets: totalResult?.total ?? 0,
          activeAssets: activeResult?.total ?? 0,
          totalValue: parseFloat(valueResult?.total || "0"),
        },
        categoryBreakdown,
        statusBreakdown,
        conditionBreakdown,
        locationBreakdown,
        departmentBreakdown,
        recentAssets,
        phases,
        kpis: kpis || null,
        financialRecovery: {
          items: recoveryItems,
          totalRecovery,
          realizedRecovery,
          pendingRecovery,
        },
        risks,
        actionItems,
        reports,
        meetings,
        billing,
        documents,
      };
    }),

  // ─── Admin: view any client dashboard (admin override) ─────────────────────
  adminViewDashboard: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) {
        throw new Error("Admin access required");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [account] = await db
        .select()
        .from(clientPortalAccounts)
        .where(eq(clientPortalAccounts.projectId, input.projectId))
        .limit(1);

      return account
        ? { ...account, passwordHash: undefined }
        : null;
    }),

  // ─── Manage Project Phases (admin) ────────────────────────────────────────────
  upsertPhase: protectedProcedure
    .input(z.object({
      id: z.number().optional(),
      projectId: z.number(),
      phaseNumber: z.number().min(1).max(4),
      phaseName: z.string(),
      status: z.enum(["not_started", "in_progress", "completed", "on_hold"]).default("not_started"),
      completionPercent: z.number().min(0).max(100).default(0),
      startDate: z.string().optional(),
      targetEndDate: z.string().optional(),
      actualEndDate: z.string().optional(),
      activities: z.array(z.string()).optional(),
      milestones: z.array(z.object({ name: z.string(), status: z.string(), date: z.string().optional() })).optional(),
      deliverables: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const data: any = {
        projectId: input.projectId,
        phaseNumber: input.phaseNumber,
        phaseName: input.phaseName,
        status: input.status,
        completionPercent: input.completionPercent,
        startDate: input.startDate ? new Date(input.startDate) : null,
        targetEndDate: input.targetEndDate ? new Date(input.targetEndDate) : null,
        actualEndDate: input.actualEndDate ? new Date(input.actualEndDate) : null,
        activities: input.activities || null,
        milestones: input.milestones || null,
        deliverables: input.deliverables || null,
      };

      if (input.id) {
        await db.update(projectPhases).set(data).where(eq(projectPhases.id, input.id));
        return { id: input.id };
      } else {
        const result = await db.insert(projectPhases).values(data);
        return { id: result[0].insertId };
      }
    }),

  // ─── Manage KPIs (admin) ──────────────────────────────────────────────────────
  upsertKpis: protectedProcedure
    .input(z.object({
      projectId: z.number(),
      totalAssetsInFar: z.number().optional(),
      assetsReviewed: z.number().optional(),
      assetsPhysicallyVerified: z.number().optional(),
      assetsRemaining: z.number().optional(),
      assetsMatchedToFar: z.number().optional(),
      assetsNotFound: z.number().optional(),
      assetsFoundNotRecorded: z.number().optional(),
      duplicateRecords: z.number().optional(),
      assetsRequiringInvestigation: z.number().optional(),
      estimatedHiddenCapital: z.string().optional(),
      verifiedRecoveryOpportunities: z.string().optional(),
      potentialAnnualSavings: z.string().optional(),
      openHighRiskExceptions: z.number().optional(),
      financialStatus: z.enum(["preliminary_estimate", "under_review", "client_validated", "approved_for_action", "actual_realized"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [existing] = await db.select().from(projectKpis).where(eq(projectKpis.projectId, input.projectId)).limit(1);

      const data: any = { ...input };
      delete data.projectId;

      if (existing) {
        await db.update(projectKpis).set(data).where(eq(projectKpis.id, existing.id));
        return { id: existing.id };
      } else {
        const result = await db.insert(projectKpis).values({ projectId: input.projectId, ...data });
        return { id: result[0].insertId };
      }
    }),

  // ─── Manage Financial Recovery (admin) ────────────────────────────────────────
  createRecoveryItem: protectedProcedure
    .input(z.object({
      projectId: z.number(),
      category: z.enum(["avoided_replacement", "sale_disposal", "insurance_tax_exposure", "maintenance_elimination", "licensing_elimination", "idle_capital", "redeployment", "disposal_recommendation", "other"]),
      description: z.string().optional(),
      amount: z.string(),
      status: z.enum(["identified", "under_review", "verified", "client_decision_required", "approved", "in_progress", "realized", "rejected", "closed"]).default("identified"),
      assetId: z.number().optional(),
      responsibleParty: z.string().optional(),
      owner: z.string().optional(),
      dueDate: z.string().optional(),
      dateIdentified: z.string().optional(),
      targetCompletionDate: z.string().optional(),
      title: z.string().optional(),
      estimatedValue: z.string().optional(),
      verifiedValue: z.string().optional(),
      realizedValue: z.string().optional(),
      recommendedAction: z.string().optional(),
      isClientVisible: z.number().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(financialRecovery).values({
        ...input,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        dateIdentified: input.dateIdentified ? new Date(input.dateIdentified) : null,
        targetCompletionDate: input.targetCompletionDate ? new Date(input.targetCompletionDate) : null,
      });
      return { id: result[0].insertId };
    }),

  updateRecoveryItem: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["identified", "under_review", "verified", "client_decision_required", "approved", "in_progress", "realized", "rejected", "closed"]).optional(),
      amount: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      estimatedValue: z.string().optional(),
      verifiedValue: z.string().optional(),
      realizedValue: z.string().optional(),
      owner: z.string().optional(),
      responsibleParty: z.string().optional(),
      recommendedAction: z.string().optional(),
      isClientVisible: z.number().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...data } = input;
      await db.update(financialRecovery).set(data).where(eq(financialRecovery.id, id));
      return { success: true };
    }),

  // ─── Manage Risk Exceptions (admin) ───────────────────────────────────────────
  createRisk: protectedProcedure
    .input(z.object({
      projectId: z.number(),
      riskType: z.enum(["high_value_missing", "no_custodian", "uninsured", "no_documentation", "unauthorized_location", "duplicate_purchase", "obsolete_equipment", "cybersecurity", "compliance", "pending_decision", "other"]),
      riskLevel: z.enum(["critical", "high", "medium", "low"]).default("medium"),
      title: z.string().optional(),
      severity: z.enum(["critical", "high", "moderate", "low"]).optional(),
      owner: z.string().optional(),
      assetId: z.number().optional(),
      assetTag: z.string().optional(),
      location: z.string().optional(),
      financialExposure: z.string().optional(),
      description: z.string().optional(),
      recommendedAction: z.string().optional(),
      responsibleParty: z.string().optional(),
      dueDate: z.string().optional(),
      targetResolutionDate: z.string().optional(),
      resolutionNotes: z.string().optional(),
      isClientVisible: z.number().default(1),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const result = await db.insert(riskExceptions).values({
        ...input,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        targetResolutionDate: input.targetResolutionDate ? new Date(input.targetResolutionDate) : null,
      });
      return { id: result[0].insertId };
    }),

  updateRisk: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["open", "in_progress", "resolved", "accepted", "escalated"]).optional(),
      riskLevel: z.enum(["critical", "high", "medium", "low"]).optional(),
      title: z.string().optional(),
      severity: z.enum(["critical", "high", "moderate", "low"]).optional(),
      owner: z.string().optional(),
      description: z.string().optional(),
      financialExposure: z.string().optional(),
      recommendedAction: z.string().optional(),
      responsibleParty: z.string().optional(),
      targetResolutionDate: z.string().optional(),
      resolutionNotes: z.string().optional(),
      isClientVisible: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, targetResolutionDate, ...data } = input;
      const updateData: any = { ...data };
      if (targetResolutionDate !== undefined) updateData.targetResolutionDate = targetResolutionDate ? new Date(targetResolutionDate) : null;
      await db.update(riskExceptions).set(updateData).where(eq(riskExceptions.id, id));
      return { success: true };
    }),

  // ─── Manage Action Items (admin creates, client responds) ─────────────────────
  createActionItem: protectedProcedure
    .input(z.object({
      projectId: z.number(),
      actionType: z.enum(["document_approval", "question", "asset_clarification", "milestone_acceptance", "change_order", "meeting_confirmation", "corrective_action", "upload_document", "other"]),
      title: z.string(),
      description: z.string().optional(),
      priority: z.enum(["urgent", "high", "normal", "low"]).default("normal"),
      assignedTo: z.string().optional(),
      dueDate: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const result = await db.insert(clientActionItems).values({
        ...input,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
      });
      return { id: result[0].insertId };
    }),

  // Client responds to action item
  respondToAction: publicProcedure
    .input(z.object({
      actionId: z.number(),
      accessToken: z.string(),
      response: z.string(),
      status: z.enum(["approved", "rejected", "completed"]),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify token
      const [action] = await db.select().from(clientActionItems).where(eq(clientActionItems.id, input.actionId)).limit(1);
      if (!action) throw new Error("Action item not found");

      const [account] = await db.select().from(clientPortalAccounts)
        .where(and(eq(clientPortalAccounts.projectId, action.projectId), eq(clientPortalAccounts.accessToken, input.accessToken), eq(clientPortalAccounts.isActive, 1)))
        .limit(1);
      if (!account) throw new Error("Access denied");

      await db.update(clientActionItems).set({
        response: input.response,
        status: input.status,
        completedAt: new Date(),
      }).where(eq(clientActionItems.id, input.actionId));

      return { success: true };
    }),

  // ─── Manage Reports (admin) ───────────────────────────────────────────────────
  createReport: protectedProcedure
    .input(z.object({
      projectId: z.number(),
      reportType: z.enum(["executive_assessment", "verification_analysis", "reconciled_far", "discrepancy_matrix", "inventory_master_log", "recovery_register", "governance_scorecard", "risk_exception_report", "location_report", "asset_photographs", "meeting_summary", "final_presentation", "technology_plan", "quarterly_report", "other"]),
      title: z.string(),
      version: z.string().optional(),
      status: z.enum(["draft", "in_review", "final", "superseded"]).default("draft"),
      storageKey: z.string().optional(),
      storageUrl: z.string().optional(),
      fileName: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const result = await db.insert(projectReports).values(input);
      return { id: result[0].insertId };
    }),

  // ─── Manage Meetings (admin) ──────────────────────────────────────────────────
  createMeeting: protectedProcedure
    .input(z.object({
      projectId: z.number(),
      meetingType: z.enum(["kickoff", "status_update", "review", "qbr", "ad_hoc", "final"]).default("status_update"),
      messageType: z.enum(["meeting", "message", "note"]).default("meeting"),
      title: z.string(),
      scheduledDate: z.string().optional(),
      duration: z.number().optional(),
      location: z.string().optional(),
      attendees: z.array(z.string()).optional(),
      agenda: z.string().optional(),
      summary: z.string().optional(),
      decisions: z.array(z.string()).optional(),
      actionItems: z.array(z.string()).optional(),
      followUpAction: z.string().optional(),
      dueDate: z.string().optional(),
      isClientVisible: z.number().default(1),
      status: z.enum(["scheduled", "completed", "cancelled", "rescheduled"]).default("scheduled"),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { dueDate, messageType, ...rest } = input;
      const result = await db.insert(projectMeetings).values({
        ...rest,
        scheduledDate: rest.scheduledDate ? new Date(rest.scheduledDate) : null,
        followUpDueDate: dueDate ? new Date(dueDate) : null,
      });
      return { id: result[0].insertId };
    }),

  // ─── Manage Billing (admin) ───────────────────────────────────────────────────
  createBillingItem: protectedProcedure
    .input(z.object({
      projectId: z.number(),
      itemType: z.enum(["invoice", "payment", "change_order", "credit"]),
      description: z.string(),
      amount: z.string(),
      amountPaid: z.string().optional(),
      remainingBalance: z.string().optional(),
      status: z.enum(["draft", "upcoming", "due", "sent", "partially_paid", "paid", "past_due", "overdue", "cancelled", "disputed", "pending", "approved", "rejected"]).default("draft"),
      invoiceNumber: z.string().optional(),
      billingPeriod: z.string().optional(),
      invoiceDate: z.string().optional(),
      dueDate: z.string().optional(),
      paidDate: z.string().optional(),
      paymentReceivedDate: z.string().optional(),
      nextPaymentDate: z.string().optional(),
      nextPaymentAmount: z.string().optional(),
      pastDueAmount: z.string().optional(),
      notes: z.string().optional(),
      isClientVisible: z.number().default(1),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const result = await db.insert(projectBilling).values({
        ...input,
        invoiceDate: input.invoiceDate ? new Date(input.invoiceDate) : null,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        paidDate: input.paidDate ? new Date(input.paidDate) : null,
        paymentReceivedDate: input.paymentReceivedDate ? new Date(input.paymentReceivedDate) : null,
        nextPaymentDate: input.nextPaymentDate ? new Date(input.nextPaymentDate) : null,
        createdBy: ctx.user?.id || null,
      });
      return { id: result[0].insertId };
    }),

  // ─── Delete procedures (admin) ────────────────────────────────────────────────
  deleteRecoveryItem: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(financialRecovery).where(eq(financialRecovery.id, input.id));
      return { success: true };
    }),

  deleteRisk: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(riskExceptions).where(eq(riskExceptions.id, input.id));
      return { success: true };
    }),

  deleteActionItem: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(clientActionItems).where(eq(clientActionItems.id, input.id));
      return { success: true };
    }),

  updateActionItem: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "in_review", "approved", "rejected", "completed", "overdue"]).optional(),
      priority: z.enum(["urgent", "high", "normal", "low"]).optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      dueDate: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, dueDate, ...data } = input;
      const updateData: any = { ...data };
      if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
      await db.update(clientActionItems).set(updateData).where(eq(clientActionItems.id, id));
      return { success: true };
    }),

  deleteReport: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(projectReports).where(eq(projectReports.id, input.id));
      return { success: true };
    }),

  updateReport: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["draft", "in_review", "final", "superseded"]).optional(),
      title: z.string().optional(),
      version: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...data } = input;
      await db.update(projectReports).set(data).where(eq(projectReports.id, id));
      return { success: true };
    }),

  deleteMeeting: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(projectMeetings).where(eq(projectMeetings.id, input.id));
      return { success: true };
    }),

  updateMeeting: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["scheduled", "completed", "cancelled", "rescheduled"]).optional(),
      title: z.string().optional(),
      summary: z.string().optional(),
      scheduledDate: z.string().optional(),
      decisions: z.array(z.string()).optional(),
      actionItems: z.array(z.string()).optional(),
      followUpAction: z.string().optional(),
      dueDate: z.string().optional(),
      isClientVisible: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, scheduledDate, dueDate, ...data } = input;
      const updateData: any = { ...data };
      if (scheduledDate !== undefined) updateData.scheduledDate = scheduledDate ? new Date(scheduledDate) : null;
      if (dueDate !== undefined) updateData.followUpDueDate = dueDate ? new Date(dueDate) : null;
      await db.update(projectMeetings).set(updateData).where(eq(projectMeetings.id, id));
      return { success: true };
    }),

  deleteBillingItem: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(projectBilling).where(eq(projectBilling.id, input.id));
      return { success: true };
    }),

  updateBillingItem: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["draft", "upcoming", "due", "sent", "partially_paid", "paid", "past_due", "overdue", "cancelled", "disputed", "pending", "approved", "rejected"]).optional(),
      amount: z.string().optional(),
      amountPaid: z.string().optional(),
      remainingBalance: z.string().optional(),
      description: z.string().optional(),
      invoiceNumber: z.string().optional(),
      billingPeriod: z.string().optional(),
      invoiceDate: z.string().optional(),
      dueDate: z.string().optional(),
      paidDate: z.string().optional(),
      paymentReceivedDate: z.string().optional(),
      nextPaymentDate: z.string().optional(),
      nextPaymentAmount: z.string().optional(),
      pastDueAmount: z.string().optional(),
      notes: z.string().optional(),
      isClientVisible: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, dueDate, paidDate, invoiceDate, paymentReceivedDate, nextPaymentDate, ...data } = input;
      const updateData: any = { ...data, updatedBy: ctx.user?.id || null };
      if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
      if (paidDate !== undefined) updateData.paidDate = paidDate ? new Date(paidDate) : null;
      if (invoiceDate !== undefined) updateData.invoiceDate = invoiceDate ? new Date(invoiceDate) : null;
      if (paymentReceivedDate !== undefined) updateData.paymentReceivedDate = paymentReceivedDate ? new Date(paymentReceivedDate) : null;
      if (nextPaymentDate !== undefined) updateData.nextPaymentDate = nextPaymentDate ? new Date(nextPaymentDate) : null;
      await db.update(projectBilling).set(updateData).where(eq(projectBilling.id, id));
      return { success: true };
    }),

  // ─── List procedures for admin management panels ──────────────────────────────
  listRecoveryItems: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return db.select().from(financialRecovery).where(eq(financialRecovery.projectId, input.projectId)).orderBy(desc(financialRecovery.createdAt));
    }),

  listRisks: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return db.select().from(riskExceptions).where(eq(riskExceptions.projectId, input.projectId)).orderBy(desc(riskExceptions.createdAt));
    }),

  listActionItems: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return db.select().from(clientActionItems).where(eq(clientActionItems.projectId, input.projectId)).orderBy(desc(clientActionItems.createdAt));
    }),

  listReports: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return db.select().from(projectReports).where(eq(projectReports.projectId, input.projectId)).orderBy(desc(projectReports.createdAt));
    }),

  listMeetings: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return db.select().from(projectMeetings).where(eq(projectMeetings.projectId, input.projectId)).orderBy(desc(projectMeetings.scheduledDate));
    }),

  listBillingItems: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return db.select().from(projectBilling).where(eq(projectBilling.projectId, input.projectId)).orderBy(desc(projectBilling.createdAt));
    }),

  listPhases: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!isAdminUser(ctx.user)) throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return db.select().from(projectPhases).where(eq(projectPhases.projectId, input.projectId)).orderBy(projectPhases.phaseNumber);
    }),
});
