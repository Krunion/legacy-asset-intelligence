import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { assets, assetPhotos, assetDocuments, assetCategories, assetProjects } from "../../drizzle/schema";
import { eq, like, or, and, desc, asc, sql, count } from "drizzle-orm";
import { storagePut } from "../storage";

// Generate a unique asset tag: LAI-XXXXXX
function generateAssetTag(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let tag = "LAI-";
  for (let i = 0; i < 6; i++) {
    tag += chars[Math.floor(Math.random() * chars.length)];
  }
  return tag;
}

export const assetsRouter = router({
  // ═══════════════════════════════════════════════════════════════════════════════
  // PROJECTS
  // ═══════════════════════════════════════════════════════════════════════════════

  // ─── List all projects ─────────────────────────────────────────────────────
  listProjects: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return db.select().from(assetProjects).orderBy(desc(assetProjects.updatedAt));
  }),

  // ─── Get single project ────────────────────────────────────────────────────
  getProject: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [project] = await db.select().from(assetProjects).where(eq(assetProjects.id, input.id)).limit(1);
      if (!project) throw new Error("Project not found");
      return project;
    }),

  // ─── Create project ────────────────────────────────────────────────────────
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(500),
        description: z.string().optional(),
        clientName: z.string().optional(),
        clientContact: z.string().optional(),
        location: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(assetProjects).values({
        name: input.name,
        description: input.description || null,
        clientName: input.clientName || null,
        clientContact: input.clientContact || null,
        location: input.location || null,
        createdBy: ctx.user?.id ?? 0,
      });

      return { id: result[0].insertId };
    }),

  // ─── Update project ────────────────────────────────────────────────────────
  updateProject: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(500).optional(),
        description: z.string().nullable().optional(),
        clientName: z.string().nullable().optional(),
        clientContact: z.string().nullable().optional(),
        location: z.string().nullable().optional(),
        status: z.enum(["active", "completed", "archived", "on_hold"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...updateData } = input;
      const updateSet: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(updateData)) {
        if (value !== undefined) updateSet[key] = value;
      }
      if (Object.keys(updateSet).length > 0) {
        await db.update(assetProjects).set(updateSet).where(eq(assetProjects.id, id));
      }
      return { success: true };
    }),

  // ─── Delete project (admin only) ──────────────────────────────────────────
  deleteProject: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Only admins can delete projects
      if (ctx.user?.role !== "admin") {
        throw new Error("Only system administrators can delete projects");
      }

      // Delete all assets, photos, documents in this project
      const projectAssets = await db.select({ id: assets.id }).from(assets).where(eq(assets.projectId, input.id));
      for (const a of projectAssets) {
        await db.delete(assetPhotos).where(eq(assetPhotos.assetId, a.id));
        await db.delete(assetDocuments).where(eq(assetDocuments.assetId, a.id));
      }
      await db.delete(assets).where(eq(assets.projectId, input.id));
      await db.delete(assetProjects).where(eq(assetProjects.id, input.id));

      return { success: true };
    }),

  // ═══════════════════════════════════════════════════════════════════════════════
  // ASSETS (all scoped by projectId)
  // ═══════════════════════════════════════════════════════════════════════════════

  // ─── List assets with pagination, search, and filters ───────────────────────
  list: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(25),
        search: z.string().optional(),
        status: z.enum(["active", "inactive", "disposed", "in_repair", "lost", "transferred", "dam_op", "dam_inop"]).optional(),
        categoryId: z.number().optional(),
        sortBy: z.enum(["name", "assetTag", "createdAt", "updatedAt", "manufacturer", "location"]).default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { projectId, page, pageSize, search, status, categoryId, sortBy, sortOrder } = input;
      const offset = (page - 1) * pageSize;

      // Build conditions — always filter by projectId
      const conditions = [eq(assets.projectId, projectId)];
      if (search) {
        conditions.push(
          or(
            like(assets.name, `%${search}%`),
            like(assets.assetTag, `%${search}%`),
            like(assets.serialNumber, `%${search}%`),
            like(assets.manufacturer, `%${search}%`),
            like(assets.location, `%${search}%`),
            like(assets.department, `%${search}%`)
          )!
        );
      }
      if (status) {
        conditions.push(eq(assets.status, status));
      }
      if (categoryId) {
        conditions.push(eq(assets.categoryId, categoryId));
      }

      const whereClause = and(...conditions);

      // Sort
      const sortColumn = {
        name: assets.name,
        assetTag: assets.assetTag,
        createdAt: assets.createdAt,
        updatedAt: assets.updatedAt,
        manufacturer: assets.manufacturer,
        location: assets.location,
      }[sortBy];
      const orderFn = sortOrder === "asc" ? asc : desc;

      // Query
      const [items, totalResult] = await Promise.all([
        db
          .select()
          .from(assets)
          .where(whereClause)
          .orderBy(orderFn(sortColumn))
          .limit(pageSize)
          .offset(offset),
        db
          .select({ total: count() })
          .from(assets)
          .where(whereClause),
      ]);

      return {
        items,
        total: totalResult[0]?.total ?? 0,
        page,
        pageSize,
        totalPages: Math.ceil((totalResult[0]?.total ?? 0) / pageSize),
      };
    }),

  // ─── Get single asset with photos and documents ─────────────────────────────
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [asset] = await db.select().from(assets).where(eq(assets.id, input.id)).limit(1);
      if (!asset) throw new Error("Asset not found");

      const photos = await db.select().from(assetPhotos).where(eq(assetPhotos.assetId, input.id));
      const docs = await db.select().from(assetDocuments).where(eq(assetDocuments.assetId, input.id));

      return { ...asset, photos, documents: docs };
    }),

  // ─── Get asset by barcode/tag scan ──────────────────────────────────────────
  getByTag: protectedProcedure
    .input(z.object({ tag: z.string(), projectId: z.number().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const conditions = [
        or(eq(assets.assetTag, input.tag), eq(assets.barcodeValue, input.tag), eq(assets.serialNumber, input.tag))!,
      ];
      if (input.projectId) {
        conditions.push(eq(assets.projectId, input.projectId));
      }

      const [asset] = await db
        .select()
        .from(assets)
        .where(and(...conditions))
        .limit(1);

      if (!asset) return null;

      const photos = await db.select().from(assetPhotos).where(eq(assetPhotos.assetId, asset.id));
      return { ...asset, photos };
    }),

  // ─── Create asset ──────────────────────────────────────────────────────────
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        name: z.string().min(1).max(500),
        description: z.string().optional(),
        categoryId: z.number().optional(),
        status: z.enum(["active", "inactive", "disposed", "in_repair", "lost", "transferred", "dam_op", "dam_inop"]).default("active"),
        condition: z.enum(["new", "excellent", "good", "fair", "poor", "salvage"]).default("good"),
        manufacturer: z.string().optional(),
        model: z.string().optional(),
        serialNumber: z.string().optional(),
        location: z.string().optional(),
        building: z.string().optional(),
        floor: z.string().optional(),
        room: z.string().optional(),
        department: z.string().optional(),
        assignedTo: z.string().optional(),
        custodian: z.string().optional(),
        addressStreet: z.string().optional(),
        addressCity: z.string().optional(),
        addressState: z.string().optional(),
        addressZip: z.string().optional(),
        parentAssetTag: z.string().optional(),
        acquisitionDate: z.string().optional(),
        acquisitionCost: z.string().optional(),
        currentValue: z.string().optional(),
        salvageValue: z.string().optional(),
        usefulLifeYears: z.number().optional(),
        warrantyExpiration: z.string().optional(),
        quantity: z.number().min(1).default(1),
        unitOfMeasure: z.string().default("each"),
        barcodeType: z.string().default("code128"),
        customFields: z.record(z.string(), z.string()).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Generate unique asset tag
      let assetTag = generateAssetTag();
      for (let i = 0; i < 5; i++) {
        const existing = await db.select({ id: assets.id }).from(assets).where(eq(assets.assetTag, assetTag)).limit(1);
        if (existing.length === 0) break;
        assetTag = generateAssetTag();
      }

      const result = await db.insert(assets).values({
        assetTag,
        projectId: input.projectId,
        name: input.name,
        description: input.description || null,
        categoryId: input.categoryId || null,
        status: input.status,
        condition: input.condition,
        manufacturer: input.manufacturer || null,
        model: input.model || null,
        serialNumber: input.serialNumber || null,
        location: input.location || null,
        building: input.building || null,
        floor: input.floor || null,
        room: input.room || null,
        department: input.department || null,
        assignedTo: input.assignedTo || null,
        custodian: input.custodian || null,
        addressStreet: input.addressStreet || null,
        addressCity: input.addressCity || null,
        addressState: input.addressState || null,
        addressZip: input.addressZip || null,
        parentAssetTag: input.parentAssetTag || null,
        acquisitionDate: input.acquisitionDate ? new Date(input.acquisitionDate) : null,
        acquisitionCost: input.acquisitionCost || null,
        currentValue: input.currentValue || null,
        salvageValue: input.salvageValue || null,
        usefulLifeYears: input.usefulLifeYears || null,
        warrantyExpiration: input.warrantyExpiration ? new Date(input.warrantyExpiration) : null,
        quantity: input.quantity,
        unitOfMeasure: input.unitOfMeasure,
        barcodeType: input.barcodeType,
        barcodeValue: assetTag,
        customFields: input.customFields || null,
        notes: input.notes || null,
        createdBy: ctx.user?.id || null,
        updatedBy: ctx.user?.id || null,
      });

      // Update project asset count
      await db.update(assetProjects).set({
        assetCount: sql`${assetProjects.assetCount} + 1`,
      }).where(eq(assetProjects.id, input.projectId));

      return { id: result[0].insertId, assetTag };
    }),

  // ─── Update asset ──────────────────────────────────────────────────────────
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(500).optional(),
        description: z.string().optional(),
        categoryId: z.number().nullable().optional(),
        status: z.enum(["active", "inactive", "disposed", "in_repair", "lost", "transferred", "dam_op", "dam_inop"]).optional(),
        condition: z.enum(["new", "excellent", "good", "fair", "poor", "salvage"]).optional(),
        manufacturer: z.string().optional(),
        model: z.string().optional(),
        serialNumber: z.string().optional(),
        location: z.string().optional(),
        building: z.string().optional(),
        floor: z.string().optional(),
        room: z.string().optional(),
        department: z.string().optional(),
        assignedTo: z.string().optional(),
        custodian: z.string().optional(),
        addressStreet: z.string().nullable().optional(),
        addressCity: z.string().nullable().optional(),
        addressState: z.string().nullable().optional(),
        addressZip: z.string().nullable().optional(),
        parentAssetTag: z.string().nullable().optional(),
        acquisitionDate: z.string().nullable().optional(),
        acquisitionCost: z.string().nullable().optional(),
        currentValue: z.string().nullable().optional(),
        salvageValue: z.string().nullable().optional(),
        usefulLifeYears: z.number().nullable().optional(),
        warrantyExpiration: z.string().nullable().optional(),
        quantity: z.number().min(1).optional(),
        unitOfMeasure: z.string().optional(),
        barcodeType: z.string().optional(),
        customFields: z.record(z.string(), z.string()).nullable().optional(),
        notes: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...updateData } = input;
      const updateSet: Record<string, unknown> = { updatedBy: ctx.user?.id };

      for (const [key, value] of Object.entries(updateData)) {
        if (value !== undefined) {
          if ((key === "acquisitionDate" || key === "warrantyExpiration") && value) {
            updateSet[key] = new Date(value as string);
          } else {
            updateSet[key] = value;
          }
        }
      }

      await db.update(assets).set(updateSet).where(eq(assets.id, id));
      return { success: true };
    }),

  // ─── Delete asset ──────────────────────────────────────────────────────────
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get the asset to find its projectId
      const [asset] = await db.select({ projectId: assets.projectId }).from(assets).where(eq(assets.id, input.id)).limit(1);

      // Delete photos and documents first
      await db.delete(assetPhotos).where(eq(assetPhotos.assetId, input.id));
      await db.delete(assetDocuments).where(eq(assetDocuments.assetId, input.id));
      await db.delete(assets).where(eq(assets.id, input.id));

      // Update project asset count
      if (asset) {
        await db.update(assetProjects).set({
          assetCount: sql`GREATEST(${assetProjects.assetCount} - 1, 0)`,
        }).where(eq(assetProjects.id, asset.projectId));
      }

      return { success: true };
    }),

  // ─── Upload photo ──────────────────────────────────────────────────────────
  uploadPhoto: protectedProcedure
    .input(
      z.object({
        assetId: z.number(),
        fileName: z.string(),
        mimeType: z.string(),
        base64Data: z.string(),
        caption: z.string().optional(),
        isPrimary: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const buffer = Buffer.from(input.base64Data, "base64");
      const key = `assets/${input.assetId}/photos/${input.fileName}`;
      const { key: storageKey, url: storageUrl } = await storagePut(key, buffer, input.mimeType);

      if (input.isPrimary) {
        await db.update(assetPhotos).set({ isPrimary: 0 }).where(eq(assetPhotos.assetId, input.assetId));
      }

      const result = await db.insert(assetPhotos).values({
        assetId: input.assetId,
        storageKey,
        storageUrl,
        fileName: input.fileName,
        mimeType: input.mimeType,
        fileSize: buffer.length,
        caption: input.caption || null,
        isPrimary: input.isPrimary ? 1 : 0,
      });

      return { id: result[0].insertId, url: storageUrl };
    }),

  // ─── Delete photo ──────────────────────────────────────────────────────────
  deletePhoto: protectedProcedure
    .input(z.object({ photoId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(assetPhotos).where(eq(assetPhotos.id, input.photoId));
      return { success: true };
    }),

  // ─── Upload document ───────────────────────────────────────────────────────
  uploadDocument: protectedProcedure
    .input(
      z.object({
        assetId: z.number(),
        fileName: z.string(),
        mimeType: z.string(),
        base64Data: z.string(),
        documentType: z.enum(["warranty", "manual", "invoice", "receipt", "maintenance_record", "other"]).default("other"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const buffer = Buffer.from(input.base64Data, "base64");
      const key = `assets/${input.assetId}/docs/${input.fileName}`;
      const { key: storageKey, url: storageUrl } = await storagePut(key, buffer, input.mimeType);

      const result = await db.insert(assetDocuments).values({
        assetId: input.assetId,
        storageKey,
        storageUrl,
        fileName: input.fileName,
        mimeType: input.mimeType,
        fileSize: buffer.length,
        documentType: input.documentType,
      });

      return { id: result[0].insertId, url: storageUrl };
    }),

  // ─── Categories CRUD ───────────────────────────────────────────────────────
  listCategories: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return db.select().from(assetCategories).orderBy(asc(assetCategories.name));
  }),

  createCategory: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        parentId: z.number().optional(),
        color: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const result = await db.insert(assetCategories).values({
        name: input.name,
        description: input.description || null,
        parentId: input.parentId || null,
        color: input.color || null,
      });
      return { id: result[0].insertId };
    }),

  deleteCategory: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.update(assets).set({ categoryId: null }).where(eq(assets.categoryId, input.id));
      await db.delete(assetCategories).where(eq(assetCategories.id, input.id));
      return { success: true };
    }),

  // ─── Bulk import from CSV ──────────────────────────────────────────────────
  bulkImport: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        assets: z.array(
          z.object({
            name: z.string(),
            manufacturer: z.string().optional(),
            model: z.string().optional(),
            serialNumber: z.string().optional(),
            location: z.string().optional(),
            department: z.string().optional(),
            quantity: z.number().optional(),
            condition: z.string().optional(),
            acquisitionDate: z.string().optional(),
            acquisitionCost: z.string().optional(),
            notes: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let imported = 0;
      const errors: string[] = [];

      for (const item of input.assets) {
        try {
          let assetTag = generateAssetTag();
          const existing = await db.select({ id: assets.id }).from(assets).where(eq(assets.assetTag, assetTag)).limit(1);
          if (existing.length > 0) assetTag = generateAssetTag();

          await db.insert(assets).values({
            assetTag,
            projectId: input.projectId,
            name: item.name,
            manufacturer: item.manufacturer || null,
            model: item.model || null,
            serialNumber: item.serialNumber || null,
            location: item.location || null,
            department: item.department || null,
            quantity: item.quantity || 1,
            condition: (item.condition as any) || "good",
            acquisitionDate: item.acquisitionDate ? new Date(item.acquisitionDate) : null,
            acquisitionCost: item.acquisitionCost || null,
            notes: item.notes || null,
            barcodeValue: assetTag,
            createdBy: ctx.user?.id || null,
            updatedBy: ctx.user?.id || null,
          });
          imported++;
        } catch (err: any) {
          errors.push(`Row "${item.name}": ${err.message}`);
        }
      }

      // Update project asset count
      if (imported > 0) {
        await db.update(assetProjects).set({
          assetCount: sql`${assetProjects.assetCount} + ${imported}`,
        }).where(eq(assetProjects.id, input.projectId));
      }

      return { imported, errors, total: input.assets.length };
    }),

  // ─── Stats for dashboard (scoped by project) ─────────────────────────────
  stats: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const projectCondition = eq(assets.projectId, input.projectId);

      const [totalResult] = await db.select({ total: count() }).from(assets).where(projectCondition);
      const [activeResult] = await db.select({ total: count() }).from(assets).where(and(projectCondition, eq(assets.status, "active")));
      const [categoryResult] = await db.select({ total: count() }).from(assetCategories);

      const [costResult] = await db
        .select({ total: sql<string>`COALESCE(SUM(acquisitionCost), 0)` })
        .from(assets)
        .where(and(projectCondition, eq(assets.status, "active")));

      return {
        totalAssets: totalResult?.total ?? 0,
        activeAssets: activeResult?.total ?? 0,
        categories: categoryResult?.total ?? 0,
        totalValue: parseFloat(costResult?.total || "0"),
      };
    }),
});
