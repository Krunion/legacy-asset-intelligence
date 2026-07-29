import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const contactSubmissions = mysqlTable("contactSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 255 }),
  lastName: varchar("lastName", { length: 255 }),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 255 }),
  message: text("message"),
  source: mysqlEnum("source", ["contact_form", "roi_calculator", "chatbot"]).notNull(),
  emailSent: int("emailSent").default(0).notNull(),
  emailError: text("emailError"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

export const videos = mysqlTable("videos", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  phaseNumber: int("phaseNumber"),
  videoData: text("videoData").notNull(),
  mimeType: varchar("mimeType", { length: 50 }).default("video/mp4").notNull(),
  fileSize: int("fileSize"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;

// ─── Asset Management System ────────────────────────────────────────────────

export const assetCategories = mysqlTable("assetCategories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  parentId: int("parentId"), // self-referencing for hierarchy
  color: varchar("color", { length: 7 }), // hex color for UI badges
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AssetCategory = typeof assetCategories.$inferSelect;
export type InsertAssetCategory = typeof assetCategories.$inferInsert;

export const assets = mysqlTable("assets", {
  id: int("id").autoincrement().primaryKey(),
  // Core identification
  assetTag: varchar("assetTag", { length: 100 }).notNull().unique(), // LAI-generated unique tag
  name: varchar("name", { length: 500 }).notNull(),
  description: text("description"),
  // Classification
  categoryId: int("categoryId"),
  status: mysqlEnum("status", ["active", "inactive", "disposed", "in_repair", "lost", "transferred"]).default("active").notNull(),
  condition: mysqlEnum("condition", ["new", "excellent", "good", "fair", "poor", "salvage"]).default("good").notNull(),
  // Manufacturer & Model
  manufacturer: varchar("manufacturer", { length: 255 }),
  model: varchar("model", { length: 255 }),
  serialNumber: varchar("serialNumber", { length: 255 }),
  // Location & Assignment
  location: varchar("location", { length: 500 }),
  building: varchar("building", { length: 255 }),
  floor: varchar("floor", { length: 50 }),
  room: varchar("room", { length: 100 }),
  department: varchar("department", { length: 255 }),
  assignedTo: varchar("assignedTo", { length: 255 }),
  custodian: varchar("custodian", { length: 255 }),
  // Financial
  acquisitionDate: timestamp("acquisitionDate"),
  acquisitionCost: decimal("acquisitionCost", { precision: 12, scale: 2 }),
  currentValue: decimal("currentValue", { precision: 12, scale: 2 }),
  salvageValue: decimal("salvageValue", { precision: 12, scale: 2 }),
  usefulLifeYears: int("usefulLifeYears"),
  // Warranty & Maintenance
  warrantyExpiration: timestamp("warrantyExpiration"),
  lastMaintenanceDate: timestamp("lastMaintenanceDate"),
  nextMaintenanceDate: timestamp("nextMaintenanceDate"),
  maintenanceNotes: text("maintenanceNotes"),
  // Quantity & Units
  quantity: int("quantity").default(1).notNull(),
  unitOfMeasure: varchar("unitOfMeasure", { length: 50 }).default("each"),
  // Barcode
  barcodeType: mysqlEnum("barcodeType", ["code128", "code39", "qr"]).default("code128"),
  barcodeValue: varchar("barcodeValue", { length: 255 }), // defaults to assetTag if not set
  // Custom fields (JSON for flexibility)
  customFields: json("customFields"),
  // Notes
  notes: text("notes"),
  // Metadata
  createdBy: int("createdBy"),
  updatedBy: int("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Asset = typeof assets.$inferSelect;
export type InsertAsset = typeof assets.$inferInsert;

export const assetPhotos = mysqlTable("assetPhotos", {
  id: int("id").autoincrement().primaryKey(),
  assetId: int("assetId").notNull(),
  storageKey: varchar("storageKey", { length: 500 }).notNull(), // S3 key
  storageUrl: varchar("storageUrl", { length: 1000 }).notNull(), // /manus-storage/... URL
  fileName: varchar("fileName", { length: 255 }),
  mimeType: varchar("mimeType", { length: 100 }),
  fileSize: int("fileSize"),
  caption: text("caption"),
  isPrimary: int("isPrimary").default(0).notNull(), // 1 = primary photo
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AssetPhoto = typeof assetPhotos.$inferSelect;
export type InsertAssetPhoto = typeof assetPhotos.$inferInsert;

export const assetDocuments = mysqlTable("assetDocuments", {
  id: int("id").autoincrement().primaryKey(),
  assetId: int("assetId").notNull(),
  storageKey: varchar("storageKey", { length: 500 }).notNull(),
  storageUrl: varchar("storageUrl", { length: 1000 }).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 100 }),
  fileSize: int("fileSize"),
  documentType: mysqlEnum("documentType", ["warranty", "manual", "invoice", "receipt", "maintenance_record", "other"]).default("other"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AssetDocument = typeof assetDocuments.$inferSelect;
export type InsertAssetDocument = typeof assetDocuments.$inferInsert;
