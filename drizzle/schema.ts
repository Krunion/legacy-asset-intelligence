import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json, bigint } from "drizzle-orm/mysql-core";

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

export const assetProjects = mysqlTable("assetProjects", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 500 }).notNull(),
  description: text("description"),
  // Client Information
  clientName: varchar("clientName", { length: 255 }),
  clientContact: varchar("clientContact", { length: 255 }),
  clientEmail: varchar("clientEmail", { length: 320 }),
  clientPhone: varchar("clientPhone", { length: 50 }),
  // Facility / Site Demographics
  facilityType: varchar("facilityType", { length: 255 }),
  industry: varchar("industry", { length: 255 }),
  squareFootage: int("squareFootage"),
  numberOfFloors: int("numberOfFloors"),
  numberOfBuildings: int("numberOfBuildings"),
  yearBuilt: int("yearBuilt"),
  // Location / Address
  location: varchar("location", { length: 500 }),
  address: varchar("address", { length: 500 }),
  city: varchar("city", { length: 255 }),
  state: varchar("state", { length: 100 }),
  zipCode: varchar("zipCode", { length: 20 }),
  country: varchar("country", { length: 100 }),
  // Project Scope & Timeline
  projectScope: text("projectScope"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  estimatedBudget: decimal("estimatedBudget", { precision: 14, scale: 2 }),
  actualBudget: decimal("actualBudget", { precision: 14, scale: 2 }),
  // Additional Info
  notes: text("notes"),
  projectManager: varchar("projectManager", { length: 255 }),
  teamSize: int("teamSize"),
  status: mysqlEnum("status", ["active", "completed", "archived", "on_hold"]).default("active").notNull(),
  assetCount: int("assetCount").default(0).notNull(),
  totalValue: decimal("totalValue", { precision: 14, scale: 2 }).default("0"),
  passwordHash: varchar("passwordHash", { length: 255 }),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AssetProject = typeof assetProjects.$inferSelect;
export type InsertAssetProject = typeof assetProjects.$inferInsert;

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
  projectId: int("projectId").notNull(), // links asset to a project
  name: varchar("name", { length: 500 }).notNull(),
  description: text("description"),
  // Classification
  categoryId: int("categoryId"),
  status: mysqlEnum("status", ["active", "inactive", "disposed", "in_repair", "lost", "transferred", "dam_op", "dam_inop"]).default("active").notNull(),
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
  // Address block
  addressStreet: varchar("addressStreet", { length: 500 }),
  addressCity: varchar("addressCity", { length: 255 }),
  addressState: varchar("addressState", { length: 100 }),
  addressZip: varchar("addressZip", { length: 20 }),
  // Room bundling — parent asset tag this asset belongs to
  parentAssetTag: varchar("parentAssetTag", { length: 100 }),
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
  barcodeType: varchar("barcodeType", { length: 50 }).default("code128"), // code128, code39, qr, datamatrix, upca, ean13, pdf417, other_unknown, no_barcode, barcode_damaged
  barcodeValue: varchar("barcodeValue", { length: 255 }), // defaults to assetTag if not set
  isReusableClientTag: int("isReusableClientTag").default(0).notNull(), // 1 = keeping client's existing tag
  clientBarcodeValue: varchar("clientBarcodeValue", { length: 500 }), // original barcode value scanned from client's existing tag
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

// ─── Project Notes & Addendums ──────────────────────────────────────────────

export const projectNotes = mysqlTable("projectNotes", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  noteType: mysqlEnum("noteType", ["note", "addendum", "update", "issue", "resolution"]).default("note").notNull(),
  isInternal: int("isInternal").default(0).notNull(), // 1 = internal only (not visible to client)
  createdBy: int("createdBy").notNull(),
  createdByName: varchar("createdByName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProjectNote = typeof projectNotes.$inferSelect;
export type InsertProjectNote = typeof projectNotes.$inferInsert;

// ─── Admin-Only Project Documents ───────────────────────────────────────────

export const projectDocuments = mysqlTable("projectDocuments", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  storageKey: varchar("storageKey", { length: 500 }).notNull(),
  storageUrl: varchar("storageUrl", { length: 1000 }).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 100 }),
  fileSize: int("fileSize"),
  documentType: mysqlEnum("documentType", ["contract", "proposal", "report", "invoice", "correspondence", "legal", "insurance", "assessment", "meeting_document", "project_deliverable", "supporting_document", "other"]).default("other"),
  description: text("description"),
  isAdminOnly: int("isAdminOnly").default(1).notNull(), // 1 = only admin can see
  isClientVisible: int("isClientVisible").default(0).notNull(), // 1 = visible to client in their portal
  uploadedBy: int("uploadedBy").notNull(),
  uploadedByName: varchar("uploadedByName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProjectDocument = typeof projectDocuments.$inferSelect;
export type InsertProjectDocument = typeof projectDocuments.$inferInsert;

// ─── Client Portal Accounts ─────────────────────────────────────────────────

export const clientPortalAccounts = mysqlTable("clientPortalAccounts", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  // Client credentials
  username: varchar("username", { length: 255 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  // Client info
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientEmail: varchar("clientEmail", { length: 320 }),
  clientCompany: varchar("clientCompany", { length: 255 }),
  // Dashboard configuration
  dashboardTitle: varchar("dashboardTitle", { length: 500 }),
  dashboardConfig: json("dashboardConfig"), // JSON config for what to show
  // Access control
  isActive: int("isActive").default(1).notNull(),
  accessToken: varchar("accessToken", { length: 255 }), // unique link token
  lastLogin: timestamp("lastLogin"),
  // Account lockout
  failedLoginAttempts: int("failedLoginAttempts").default(0).notNull(),
  lockedUntil: timestamp("lockedUntil"),
  // Metadata
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientPortalAccount = typeof clientPortalAccounts.$inferSelect;
export type InsertClientPortalAccount = typeof clientPortalAccounts.$inferInsert;

// ─── Client Executive Dashboard Tables ────────────────────────────────────────

export const projectPhases = mysqlTable("projectPhases", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  phaseNumber: int("phaseNumber").notNull(), // 1-4
  phaseName: varchar("phaseName", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["not_started", "in_progress", "completed", "on_hold"]).default("not_started").notNull(),
  completionPercent: int("completionPercent").default(0).notNull(),
  startDate: timestamp("startDate"),
  targetEndDate: timestamp("targetEndDate"),
  actualEndDate: timestamp("actualEndDate"),
  activities: json("activities"), // JSON array of activity strings
  milestones: json("milestones"), // JSON array of milestone objects
  deliverables: json("deliverables"), // JSON array of deliverable strings
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProjectPhase = typeof projectPhases.$inferSelect;
export type InsertProjectPhase = typeof projectPhases.$inferInsert;

export const projectKpis = mysqlTable("projectKpis", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  // Asset verification KPIs
  totalAssetsInFar: int("totalAssetsInFar").default(0),
  assetsReviewed: int("assetsReviewed").default(0),
  assetsPhysicallyVerified: int("assetsPhysicallyVerified").default(0),
  assetsRemaining: int("assetsRemaining").default(0),
  assetsMatchedToFar: int("assetsMatchedToFar").default(0),
  assetsNotFound: int("assetsNotFound").default(0),
  assetsFoundNotRecorded: int("assetsFoundNotRecorded").default(0),
  duplicateRecords: int("duplicateRecords").default(0),
  assetsRequiringInvestigation: int("assetsRequiringInvestigation").default(0),
  // Financial KPIs
  estimatedHiddenCapital: decimal("estimatedHiddenCapital", { precision: 14, scale: 2 }),
  verifiedRecoveryOpportunities: decimal("verifiedRecoveryOpportunities", { precision: 14, scale: 2 }),
  potentialAnnualSavings: decimal("potentialAnnualSavings", { precision: 14, scale: 2 }),
  openHighRiskExceptions: int("openHighRiskExceptions").default(0),
  // Financial status
  financialStatus: mysqlEnum("financialStatus", ["preliminary_estimate", "under_review", "client_validated", "approved_for_action", "actual_realized"]).default("preliminary_estimate"),
  // Metadata
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProjectKpi = typeof projectKpis.$inferSelect;
export type InsertProjectKpi = typeof projectKpis.$inferInsert;

export const financialRecovery = mysqlTable("financialRecovery", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  title: varchar("title", { length: 500 }),
  category: mysqlEnum("category", [
    "avoided_replacement", "sale_disposal", "insurance_tax_exposure",
    "maintenance_elimination", "licensing_elimination", "idle_capital",
    "redeployment", "disposal_recommendation", "other"
  ]).notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 14, scale: 2 }).notNull(),
  estimatedValue: decimal("estimatedValue", { precision: 14, scale: 2 }),
  verifiedValue: decimal("verifiedValue", { precision: 14, scale: 2 }),
  realizedValue: decimal("realizedValue", { precision: 14, scale: 2 }),
  status: mysqlEnum("status", [
    "identified", "under_review", "verified", "client_decision_required",
    "approved", "in_progress", "realized", "rejected", "closed"
  ]).default("identified").notNull(),
  assetId: int("assetId"),
  responsibleParty: varchar("responsibleParty", { length: 255 }),
  owner: varchar("owner", { length: 255 }),
  dueDate: timestamp("dueDate"),
  dateIdentified: timestamp("dateIdentified"),
  targetCompletionDate: timestamp("targetCompletionDate"),
  recommendedAction: text("recommendedAction"),
  notes: text("notes"),
  isClientVisible: int("isClientVisible").default(0).notNull(),
  createdBy: int("createdBy"),
  updatedBy: int("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FinancialRecovery = typeof financialRecovery.$inferSelect;
export type InsertFinancialRecovery = typeof financialRecovery.$inferInsert;

export const riskExceptions = mysqlTable("riskExceptions", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  title: varchar("title", { length: 500 }),
  riskType: mysqlEnum("riskType", [
    "high_value_missing", "no_custodian", "uninsured", "no_documentation",
    "unauthorized_location", "duplicate_purchase", "obsolete_equipment",
    "cybersecurity", "compliance", "pending_decision", "risk", "exception", "assessment", "finding", "other"
  ]).notNull(),
  riskLevel: mysqlEnum("riskLevel", ["critical", "high", "medium", "low"]).default("medium").notNull(),
  severity: mysqlEnum("severity", ["critical", "high", "moderate", "low"]).default("moderate"),
  assetId: int("assetId"),
  assetTag: varchar("assetTag", { length: 255 }),
  location: varchar("location", { length: 500 }),
  financialExposure: decimal("financialExposure", { precision: 14, scale: 2 }),
  description: text("description"),
  recommendedAction: text("recommendedAction"),
  responsibleParty: varchar("responsibleParty", { length: 255 }),
  owner: varchar("owner", { length: 255 }),
  dueDate: timestamp("dueDate"),
  identifiedDate: timestamp("identifiedDate"),
  targetResolutionDate: timestamp("targetResolutionDate"),
  resolutionNotes: text("resolutionNotes"),
  status: mysqlEnum("status", ["open", "under_review", "mitigation_in_progress", "in_progress", "resolved", "closed", "accepted", "escalated"]).default("open").notNull(),
  isClientVisible: int("isClientVisible").default(0).notNull(),
  createdBy: int("createdBy"),
  updatedBy: int("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RiskException = typeof riskExceptions.$inferSelect;
export type InsertRiskException = typeof riskExceptions.$inferInsert;

export const clientActionItems = mysqlTable("clientActionItems", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  actionType: mysqlEnum("actionType", [
    "document_approval", "question", "asset_clarification",
    "milestone_acceptance", "change_order", "meeting_confirmation",
    "corrective_action", "upload_document", "other"
  ]).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  priority: mysqlEnum("priority", ["urgent", "high", "normal", "low"]).default("normal").notNull(),
  status: mysqlEnum("status", ["pending", "in_review", "approved", "rejected", "completed", "overdue"]).default("pending").notNull(),
  assignedTo: varchar("assignedTo", { length: 255 }),
  dueDate: timestamp("dueDate"),
  completedAt: timestamp("completedAt"),
  response: text("response"),
  responseDecision: varchar("responseDecision", { length: 50 }),
  respondedBy: varchar("respondedBy", { length: 255 }),
  respondedAt: timestamp("respondedAt"),
  responseComments: text("responseComments"),
  notificationSent: int("notificationSent").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientActionItem = typeof clientActionItems.$inferSelect;
export type InsertClientActionItem = typeof clientActionItems.$inferInsert;

// ─── PM Notifications ─────────────────────────────────────────────────────────
export const pmNotifications = mysqlTable("pmNotifications", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  recipientName: varchar("recipientName", { length: 255 }),
  notificationType: mysqlEnum("notificationType", ["task_response", "document_uploaded", "billing_update", "milestone_update", "risk_escalation", "general"]).default("general").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  message: text("message").notNull(),
  relatedEntityType: varchar("relatedEntityType", { length: 100 }),
  relatedEntityId: int("relatedEntityId"),
  isRead: int("isRead").default(0).notNull(),
  isAcknowledged: int("isAcknowledged").default(0).notNull(),
  emailSent: int("emailSent").default(0).notNull(),
  emailSentAt: timestamp("emailSentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PmNotification = typeof pmNotifications.$inferSelect;
export type InsertPmNotification = typeof pmNotifications.$inferInsert;

export const projectReports = mysqlTable("projectReports", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  reportType: mysqlEnum("reportType", [
    "executive_assessment", "verification_analysis", "reconciled_far",
    "discrepancy_matrix", "inventory_master_log", "recovery_register",
    "governance_scorecard", "risk_exception_report", "location_report",
    "asset_photographs", "meeting_summary", "final_presentation",
    "technology_plan", "quarterly_report", "other"
  ]).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  version: varchar("version", { length: 50 }).default("1.0"),
  status: mysqlEnum("status", ["draft", "in_review", "final", "superseded"]).default("draft").notNull(),
  storageKey: varchar("storageKey", { length: 500 }),
  storageUrl: varchar("storageUrl", { length: 500 }),
  fileName: varchar("fileName", { length: 500 }),
  publishedAt: timestamp("publishedAt"),
  approvedBy: varchar("approvedBy", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProjectReport = typeof projectReports.$inferSelect;
export type InsertProjectReport = typeof projectReports.$inferInsert;

export const projectMeetings = mysqlTable("projectMeetings", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  meetingType: mysqlEnum("meetingType", ["kickoff", "status_update", "review", "qbr", "ad_hoc", "final", "message"]).default("status_update").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  scheduledDate: timestamp("scheduledDate"),
  duration: int("duration"), // minutes
  location: varchar("location", { length: 500 }),
  attendees: json("attendees"), // JSON array of attendee names/emails
  agenda: text("agenda"),
  summary: text("summary"),
  decisions: json("decisions"), // JSON array of decision strings
  actionItems: json("actionItems"), // JSON array of action item strings
  followUpAction: text("followUpAction"),
  followUpDueDate: timestamp("followUpDueDate"),
  attachmentStorageKey: varchar("attachmentStorageKey", { length: 500 }),
  attachmentStorageUrl: varchar("attachmentStorageUrl", { length: 1000 }),
  attachmentFileName: varchar("attachmentFileName", { length: 255 }),
  status: mysqlEnum("status", ["scheduled", "completed", "cancelled", "rescheduled"]).default("scheduled").notNull(),
  isClientVisible: int("isClientVisible").default(0).notNull(),
  createdBy: int("createdBy"),
  updatedBy: int("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProjectMeeting = typeof projectMeetings.$inferSelect;
export type InsertProjectMeeting = typeof projectMeetings.$inferInsert;

export const projectBilling = mysqlTable("projectBilling", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  itemType: mysqlEnum("itemType", ["invoice", "payment", "change_order", "credit"]).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  amount: decimal("amount", { precision: 14, scale: 2 }).notNull(),
  amountPaid: decimal("amountPaid", { precision: 14, scale: 2 }).default("0.00"),
  remainingBalance: decimal("remainingBalance", { precision: 14, scale: 2 }),
  status: mysqlEnum("status", ["draft", "upcoming", "due", "sent", "partially_paid", "paid", "past_due", "overdue", "cancelled", "disputed", "pending", "approved", "rejected"]).default("draft").notNull(),
  invoiceNumber: varchar("invoiceNumber", { length: 100 }),
  billingPeriod: varchar("billingPeriod", { length: 255 }),
  invoiceDate: timestamp("invoiceDate"),
  dueDate: timestamp("dueDate"),
  paidDate: timestamp("paidDate"),
  paymentReceivedDate: timestamp("paymentReceivedDate"),
  nextPaymentDate: timestamp("nextPaymentDate"),
  nextPaymentAmount: decimal("nextPaymentAmount", { precision: 14, scale: 2 }),
  pastDueAmount: decimal("pastDueAmount", { precision: 14, scale: 2 }),
  storageKey: varchar("storageKey", { length: 500 }),
  storageUrl: varchar("storageUrl", { length: 1000 }),
  fileName: varchar("fileName", { length: 255 }),
  notes: text("notes"),
  isClientVisible: int("isClientVisible").default(1).notNull(), // billing items visible to client by default
  createdBy: int("createdBy"),
  updatedBy: int("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProjectBilling = typeof projectBilling.$inferSelect;
export type InsertProjectBilling = typeof projectBilling.$inferInsert;

// ─── Audit History ────────────────────────────────────────────────────────────

export const auditHistory = mysqlTable("auditHistory", {
  id: int("id").autoincrement().primaryKey(),
  entityType: mysqlEnum("entityType", [
    "billing", "document", "risk", "recovery", "meeting", "report",
    "action_item", "asset", "photo", "project", "client_access", "user"
  ]).notNull(),
  entityId: int("entityId").notNull(),
  projectId: int("projectId"),
  action: mysqlEnum("action", ["create", "update", "delete", "archive", "restore", "visibility_change", "status_change", "access_grant", "access_revoke"]).notNull(),
  changedBy: int("changedBy"),
  changedByName: varchar("changedByName", { length: 255 }),
  previousValues: json("previousValues"), // JSON snapshot of changed fields before
  newValues: json("newValues"), // JSON snapshot of changed fields after
  description: text("description"), // Human-readable description of the change
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditHistory = typeof auditHistory.$inferSelect;
export type InsertAuditHistory = typeof auditHistory.$inferInsert;

// ─── Project Verification Metrics (Phase 2 specific) ────────────────────────

export const projectVerificationMetrics = mysqlTable("projectVerificationMetrics", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  // FAR Baseline
  farBaselineCount: int("farBaselineCount").default(0).notNull(),
  farBaselineValue: decimal("farBaselineValue", { precision: 14, scale: 2 }).default("0"),
  // Verification counts
  verifiedFarAssets: int("verifiedFarAssets").default(0).notNull(),
  notFoundAssets: int("notFoundAssets").default(0).notNull(),
  additionalAssetsFound: int("additionalAssetsFound").default(0).notNull(), // Zombie
  // Classification counts
  ghostAssetCount: int("ghostAssetCount").default(0).notNull(),
  ghostAssetValue: decimal("ghostAssetValue", { precision: 14, scale: 2 }).default("0"),
  zombieAssetCount: int("zombieAssetCount").default(0).notNull(),
  zombieAssetValue: decimal("zombieAssetValue", { precision: 14, scale: 2 }).default("0"),
  vampireAssetCount: int("vampireAssetCount").default(0).notNull(),
  vampireAssetValue: decimal("vampireAssetValue", { precision: 14, scale: 2 }).default("0"),
  duplicateAssetCount: int("duplicateAssetCount").default(0).notNull(),
  duplicateAssetValue: decimal("duplicateAssetValue", { precision: 14, scale: 2 }).default("0"),
  // Additional status counts
  assetsInRepair: int("assetsInRepair").default(0).notNull(),
  activeAssets: int("activeAssets").default(0).notNull(),
  // Condition distribution (JSON)
  conditionDistribution: json("conditionDistribution"), // { new: 5, excellent: 10, good: 50, ... }
  // Classification notes
  ghostNotes: text("ghostNotes"),
  zombieNotes: text("zombieNotes"),
  vampireNotes: text("vampireNotes"),
  duplicateNotes: text("duplicateNotes"),
  generalNotes: text("generalNotes"),
  // Phase 2 project info
  phase2Status: mysqlEnum("phase2Status", ["not_started", "on_track", "at_risk", "delayed", "complete"]).default("not_started").notNull(),
  phase2StartDate: timestamp("phase2StartDate"),
  phase2TargetDate: timestamp("phase2TargetDate"),
  phase2CostBasis: decimal("phase2CostBasis", { precision: 14, scale: 2 }),
  clientFacingSummary: text("clientFacingSummary"),
  internalNotes: text("internalNotes"),
  lastUpdateNotes: text("lastUpdateNotes"),
  // Metadata
  updatedBy: int("updatedBy"),
  updatedByName: varchar("updatedByName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProjectVerificationMetrics = typeof projectVerificationMetrics.$inferSelect;
export type InsertProjectVerificationMetrics = typeof projectVerificationMetrics.$inferInsert;

// ─── Project Locations ──────────────────────────────────────────────────────

export const projectLocations = mysqlTable("projectLocations", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  locationName: varchar("locationName", { length: 500 }).notNull(),
  address: text("address"),
  siteCode: varchar("siteCode", { length: 100 }),
  contact: varchar("contact", { length: 255 }),
  verificationStatus: mysqlEnum("verificationStatus", ["not_started", "in_progress", "completed", "partial"]).default("not_started").notNull(),
  scheduledDate: timestamp("scheduledDate"),
  completedDate: timestamp("completedDate"),
  clientNotes: text("clientNotes"),
  internalNotes: text("internalNotes"),
  assetCount: int("assetCount").default(0),
  isClientVisible: int("isClientVisible").default(1).notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProjectLocation = typeof projectLocations.$inferSelect;
export type InsertProjectLocation = typeof projectLocations.$inferInsert;

// ─── Project Departments ────────────────────────────────────────────────────

export const projectDepartments = mysqlTable("projectDepartments", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  departmentName: varchar("departmentName", { length: 500 }).notNull(),
  departmentCode: varchar("departmentCode", { length: 100 }),
  contact: varchar("contact", { length: 255 }),
  verificationStatus: mysqlEnum("verificationStatus", ["not_started", "in_progress", "completed", "partial"]).default("not_started").notNull(),
  scheduledDate: timestamp("scheduledDate"),
  completedDate: timestamp("completedDate"),
  clientNotes: text("clientNotes"),
  internalNotes: text("internalNotes"),
  assetCount: int("assetCount").default(0),
  isClientVisible: int("isClientVisible").default(1).notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProjectDepartment = typeof projectDepartments.$inferSelect;
export type InsertProjectDepartment = typeof projectDepartments.$inferInsert;

// ─── FAR Baseline Versions ──────────────────────────────────────────────────

export const farBaselineVersions = mysqlTable("farBaselineVersions", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  previousCount: int("previousCount").notNull(),
  newCount: int("newCount").notNull(),
  previousValue: decimal("previousValue", { precision: 14, scale: 2 }),
  newValue: decimal("newValue", { precision: 14, scale: 2 }),
  reason: text("reason").notNull(),
  changedBy: int("changedBy").notNull(),
  changedByName: varchar("changedByName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FarBaselineVersion = typeof farBaselineVersions.$inferSelect;
export type InsertFarBaselineVersion = typeof farBaselineVersions.$inferInsert;

// ─── Phase 2 Milestones ─────────────────────────────────────────────────────

export const phase2Milestones = mysqlTable("phase2Milestones", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  milestoneNumber: int("milestoneNumber").notNull(), // 1-5
  milestoneName: varchar("milestoneName", { length: 500 }).notNull(),
  status: mysqlEnum("status", ["not_started", "in_progress", "completed", "on_hold"]).default("not_started").notNull(),
  completionPercent: int("completionPercent").default(0).notNull(),
  startDate: timestamp("startDate"),
  targetDate: timestamp("targetDate"),
  completionDate: timestamp("completionDate"),
  clientUpdate: text("clientUpdate"),
  internalNote: text("internalNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Phase2Milestone = typeof phase2Milestones.$inferSelect;
export type InsertPhase2Milestone = typeof phase2Milestones.$inferInsert;
