import { getDb } from "./db";
import { auditHistory } from "../drizzle/schema";

type EntityType = "billing" | "document" | "risk" | "recovery" | "meeting" | "report" | "action_item" | "asset" | "photo" | "project" | "client_access" | "user";
type AuditAction = "create" | "update" | "delete" | "archive" | "restore" | "visibility_change" | "status_change" | "access_grant" | "access_revoke";

interface AuditLogParams {
  entityType: EntityType;
  entityId: number;
  projectId?: number | null;
  action: AuditAction;
  changedBy?: number | null;
  changedByName?: string | null;
  previousValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  description?: string | null;
}

/**
 * Log an audit entry for any entity change.
 * This is fire-and-forget — it should never block or throw to the caller.
 */
export async function logAudit(params: AuditLogParams): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;

    await db.insert(auditHistory).values({
      entityType: params.entityType,
      entityId: params.entityId,
      projectId: params.projectId ?? null,
      action: params.action,
      changedBy: params.changedBy ?? null,
      changedByName: params.changedByName ?? null,
      previousValues: params.previousValues ?? null,
      newValues: params.newValues ?? null,
      description: params.description ?? null,
    });
  } catch (error) {
    // Audit logging should never break the main operation
    console.error("[Audit] Failed to log:", error);
  }
}

/**
 * Helper to compute changed fields between old and new values.
 * Returns only the fields that actually changed.
 */
export function computeChanges(
  oldValues: Record<string, unknown>,
  newValues: Record<string, unknown>
): { previous: Record<string, unknown>; updated: Record<string, unknown> } | null {
  const previous: Record<string, unknown> = {};
  const updated: Record<string, unknown> = {};

  for (const key of Object.keys(newValues)) {
    if (newValues[key] !== undefined && newValues[key] !== oldValues[key]) {
      previous[key] = oldValues[key];
      updated[key] = newValues[key];
    }
  }

  if (Object.keys(updated).length === 0) return null;
  return { previous, updated };
}
