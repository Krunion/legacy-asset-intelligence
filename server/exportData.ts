import { Request, Response, Express } from "express";
import { ZipArchive } from "archiver";
// ZipArchive from archiver v8 extends Node Readable stream
import { getDb } from "./db";
import { storageGetSignedUrl } from "./storage";
import {
  assets, assetPhotos, assetDocuments, assetCategories, assetProjects,
  projectNotes, projectDocuments, projectPhases, projectKpis,
  financialRecovery, riskExceptions, clientActionItems, projectReports,
  projectMeetings, projectBilling
} from "../drizzle/schema";
import { eq } from "drizzle-orm";

function escapeCsv(val: any): string {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function toCsvRow(fields: any[]): string {
  return fields.map(escapeCsv).join(",") + "\n";
}

export function registerExportRoutes(app: Express) {
  app.get("/api/export/project/:projectId", async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId);
      if (isNaN(projectId)) {
        res.status(400).json({ error: "Invalid project ID" });
        return;
      }

      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      // Fetch project info
      const [project] = await db.select().from(assetProjects).where(eq(assetProjects.id, projectId)).limit(1);
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      // Set response headers for ZIP download
      const safeName = (project.name || "project").replace(/[^a-zA-Z0-9_-]/g, "_");
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", `attachment; filename="LAI_Export_${safeName}_${new Date().toISOString().split("T")[0]}.zip"`);

      // Create ZIP archive (streaming)
      const archive = new ZipArchive({ zlib: { level: 6 } }) as any;
      (archive as any).pipe(res);

      // 1. Project Info CSV
      let projectCsv = toCsvRow(["Field", "Value"]);
      projectCsv += toCsvRow(["Project Name", project.name]);
      projectCsv += toCsvRow(["Status", project.status]);
      projectCsv += toCsvRow(["Client Name", project.clientName]);
      projectCsv += toCsvRow(["Client Contact", project.clientContact]);
      projectCsv += toCsvRow(["Client Email", project.clientEmail]);
      projectCsv += toCsvRow(["Client Phone", project.clientPhone]);
      projectCsv += toCsvRow(["Industry", project.industry]);
      projectCsv += toCsvRow(["Facility Type", project.facilityType]);
      projectCsv += toCsvRow(["Square Footage", project.squareFootage]);
      projectCsv += toCsvRow(["Number of Floors", project.numberOfFloors]);
      projectCsv += toCsvRow(["Number of Buildings", project.numberOfBuildings]);
      projectCsv += toCsvRow(["Year Built", project.yearBuilt]);
      projectCsv += toCsvRow(["Address", project.address]);
      projectCsv += toCsvRow(["City", project.city]);
      projectCsv += toCsvRow(["State", project.state]);
      projectCsv += toCsvRow(["Zip Code", project.zipCode]);
      projectCsv += toCsvRow(["Country", project.country]);
      projectCsv += toCsvRow(["Location", project.location]);
      projectCsv += toCsvRow(["Project Scope", project.projectScope]);
      projectCsv += toCsvRow(["Start Date", project.startDate]);
      projectCsv += toCsvRow(["End Date", project.endDate]);
      projectCsv += toCsvRow(["Estimated Budget", project.estimatedBudget]);
      projectCsv += toCsvRow(["Actual Budget", project.actualBudget]);
      projectCsv += toCsvRow(["Project Manager", project.projectManager]);
      projectCsv += toCsvRow(["Team Size", project.teamSize]);
      projectCsv += toCsvRow(["Asset Count", project.assetCount]);
      projectCsv += toCsvRow(["Total Value", project.totalValue]);
      projectCsv += toCsvRow(["Notes", project.notes]);
      projectCsv += toCsvRow(["Created At", project.createdAt]);
      archive.append(projectCsv, { name: "01_Project_Info.csv" });

      // 2. Assets CSV
      const projectAssets = await db.select().from(assets).where(eq(assets.projectId, projectId));
      const categories = await db.select().from(assetCategories);
      const categoryMap = new Map(categories.map(c => [c.id, c.name]));

      let assetCsv = toCsvRow([
        "Asset Tag", "Name", "Description", "Category", "Status", "Condition",
        "Manufacturer", "Model", "Serial Number",
        "Location", "Building", "Floor", "Room", "Department", "Assigned To", "Custodian",
        "Address Street", "Address City", "Address State", "Address Zip",
        "Parent Asset Tag", "Acquisition Date", "Acquisition Cost",
        "Warranty Expiration", "Quantity", "Unit of Measure",
        "Barcode Type", "Barcode Value", "Is Reusable Client Tag", "Client Barcode Value",
        "Notes", "Created At", "Updated At"
      ]);
      for (const a of projectAssets) {
        assetCsv += toCsvRow([
          a.assetTag, a.name, a.description, categoryMap.get(a.categoryId ?? 0) || "", a.status, a.condition,
          a.manufacturer, a.model, a.serialNumber,
          a.location, a.building, a.floor, a.room, a.department, a.assignedTo, a.custodian,
          a.addressStreet, a.addressCity, a.addressState, a.addressZip,
          a.parentAssetTag, a.acquisitionDate, a.acquisitionCost,
          a.warrantyExpiration, a.quantity, a.unitOfMeasure,
          a.barcodeType, a.barcodeValue, a.isReusableClientTag ? "Yes" : "No", a.clientBarcodeValue,
          a.notes, a.createdAt, a.updatedAt
        ]);
      }
      archive.append(assetCsv, { name: "02_Assets.csv" });

      // 3. Asset Photos CSV (with signed URLs)
      const photos = await db.select().from(assetPhotos).where(
        sql`${assetPhotos.assetId} IN (SELECT id FROM assets WHERE projectId = ${projectId})`
      );
      if (photos.length > 0) {
        let photoCsv = toCsvRow(["Asset ID", "File Name", "MIME Type", "File Size", "Caption", "Is Primary", "Download URL", "Created At"]);
        for (const p of photos) {
          let url = "";
          try {
            url = await storageGetSignedUrl(p.storageKey) || p.storageUrl || "";
          } catch { url = p.storageUrl || ""; }
          photoCsv += toCsvRow([p.assetId, p.fileName, p.mimeType, p.fileSize, p.caption, p.isPrimary ? "Yes" : "No", url, p.createdAt]);
        }
        archive.append(photoCsv, { name: "03_Asset_Photos.csv" });
      }

      // 4. Asset Documents CSV
      const assetDocs = await db.select().from(assetDocuments).where(
        sql`${assetDocuments.assetId} IN (SELECT id FROM assets WHERE projectId = ${projectId})`
      );
      if (assetDocs.length > 0) {
        let docCsv = toCsvRow(["Asset ID", "File Name", "Document Type", "MIME Type", "File Size", "Download URL", "Created At"]);
        for (const d of assetDocs) {
          let url = "";
          try {
            url = await storageGetSignedUrl(d.storageKey) || d.storageUrl || "";
          } catch { url = d.storageUrl || ""; }
          docCsv += toCsvRow([d.assetId, d.fileName, d.documentType, d.mimeType, d.fileSize, url, d.createdAt]);
        }
        archive.append(docCsv, { name: "04_Asset_Documents.csv" });
      }

      // 5. Project Documents CSV
      const projDocs = await db.select().from(projectDocuments).where(eq(projectDocuments.projectId, projectId));
      if (projDocs.length > 0) {
        let docCsv = toCsvRow(["File Name", "Document Type", "Description", "MIME Type", "File Size", "Admin Only", "Client Visible", "Uploaded By", "Download URL", "Created At"]);
        for (const d of projDocs) {
          let url = "";
          try {
            url = await storageGetSignedUrl(d.storageKey) || d.storageUrl || "";
          } catch { url = d.storageUrl || ""; }
          docCsv += toCsvRow([d.fileName, d.documentType, d.description, d.mimeType, d.fileSize, d.isAdminOnly ? "Yes" : "No", d.isClientVisible ? "Yes" : "No", d.uploadedByName, url, d.createdAt]);
        }
        archive.append(docCsv, { name: "05_Project_Documents.csv" });
      }

      // 6. Project Notes CSV
      const notes = await db.select().from(projectNotes).where(eq(projectNotes.projectId, projectId));
      if (notes.length > 0) {
        let notesCsv = toCsvRow(["Title", "Type", "Content", "Internal Only", "Created By", "Created At"]);
        for (const n of notes) {
          notesCsv += toCsvRow([n.title, n.noteType, n.content, n.isInternal ? "Yes" : "No", n.createdByName, n.createdAt]);
        }
        archive.append(notesCsv, { name: "06_Project_Notes.csv" });
      }

      // 7. Phases CSV
      const phases = await db.select().from(projectPhases).where(eq(projectPhases.projectId, projectId));
      if (phases.length > 0) {
        let phasesCsv = toCsvRow(["Phase Number", "Phase Name", "Status", "Completion %", "Start Date", "Target End Date", "Actual End Date"]);
        for (const p of phases) {
          phasesCsv += toCsvRow([p.phaseNumber, p.phaseName, p.status, p.completionPercent, p.startDate, p.targetEndDate, p.actualEndDate]);
        }
        archive.append(phasesCsv, { name: "07_Project_Phases.csv" });
      }

      // 8. Financial Recovery CSV
      const recovery = await db.select().from(financialRecovery).where(eq(financialRecovery.projectId, projectId));
      if (recovery.length > 0) {
        let recCsv = toCsvRow(["Title", "Category", "Description", "Amount", "Estimated Value", "Verified Value", "Realized Value", "Status", "Owner", "Due Date", "Recommended Action", "Notes", "Created At"]);
        for (const r of recovery) {
          recCsv += toCsvRow([r.title, r.category, r.description, r.amount, r.estimatedValue, r.verifiedValue, r.realizedValue, r.status, r.owner, r.dueDate, r.recommendedAction, r.notes, r.createdAt]);
        }
        archive.append(recCsv, { name: "08_Financial_Recovery.csv" });
      }

      // 9. Risks & Exceptions CSV
      const risks = await db.select().from(riskExceptions).where(eq(riskExceptions.projectId, projectId));
      if (risks.length > 0) {
        let riskCsv = toCsvRow(["Title", "Risk Type", "Risk Level", "Severity", "Description", "Financial Exposure", "Owner", "Status", "Due Date", "Resolution Notes", "Created At"]);
        for (const r of risks) {
          riskCsv += toCsvRow([r.title, r.riskType, r.riskLevel, r.severity, r.description, r.financialExposure, r.owner, r.status, r.dueDate, r.resolutionNotes, r.createdAt]);
        }
        archive.append(riskCsv, { name: "09_Risks_Exceptions.csv" });
      }

      // 10. Meetings CSV
      const meetings = await db.select().from(projectMeetings).where(eq(projectMeetings.projectId, projectId));
      if (meetings.length > 0) {
        let meetCsv = toCsvRow(["Title", "Meeting Type", "Scheduled Date", "Duration (min)", "Location", "Agenda", "Summary", "Follow-Up Action", "Follow-Up Due", "Status", "Created At"]);
        for (const m of meetings) {
          meetCsv += toCsvRow([m.title, m.meetingType, m.scheduledDate, m.duration, m.location, m.agenda, m.summary, m.followUpAction, m.followUpDueDate, m.status, m.createdAt]);
        }
        archive.append(meetCsv, { name: "10_Meetings.csv" });
      }

      // 11. Billing CSV
      const billing = await db.select().from(projectBilling).where(eq(projectBilling.projectId, projectId));
      if (billing.length > 0) {
        let billCsv = toCsvRow(["Invoice #", "Item Type", "Description", "Amount", "Amount Paid", "Remaining Balance", "Status", "Billing Period", "Invoice Date", "Due Date", "Paid Date", "Past Due Amount", "Notes", "Created At"]);
        for (const b of billing) {
          billCsv += toCsvRow([b.invoiceNumber, b.itemType, b.description, b.amount, b.amountPaid, b.remainingBalance, b.status, b.billingPeriod, b.invoiceDate, b.dueDate, b.paidDate, b.pastDueAmount, b.notes, b.createdAt]);
        }
        archive.append(billCsv, { name: "11_Billing.csv" });
      }

      // 12. Action Items CSV
      const actions = await db.select().from(clientActionItems).where(eq(clientActionItems.projectId, projectId));
      if (actions.length > 0) {
        let actionCsv = toCsvRow(["Title", "Action Type", "Description", "Priority", "Status", "Assigned To", "Due Date", "Completed At", "Response", "Created At"]);
        for (const a of actions) {
          actionCsv += toCsvRow([a.title, a.actionType, a.description, a.priority, a.status, a.assignedTo, a.dueDate, a.completedAt, a.response, a.createdAt]);
        }
        archive.append(actionCsv, { name: "12_Action_Items.csv" });
      }

      // 13. Reports CSV
      const reports = await db.select().from(projectReports).where(eq(projectReports.projectId, projectId));
      if (reports.length > 0) {
        let reportCsv = toCsvRow(["Title", "Report Type", "Version", "Status", "File Name", "Published At", "Approved By", "Created At"]);
        for (const r of reports) {
          reportCsv += toCsvRow([r.title, r.reportType, r.version, r.status, r.fileName, r.publishedAt, r.approvedBy, r.createdAt]);
        }
        archive.append(reportCsv, { name: "13_Reports.csv" });
      }

      // Finalize archive
      await archive.finalize();
    } catch (error: any) {
      console.error("[Export] Error generating export:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to generate export" });
      }
    }
  });
}

// Need to import sql from drizzle-orm
import { sql } from "drizzle-orm";
