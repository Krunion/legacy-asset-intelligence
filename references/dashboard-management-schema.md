# Dashboard Management Schema Reference

## Backend CRUD Procedures (server/routers/clientPortal.ts)
- createRecoveryItem: { projectId, category (enum), description?, amount, status (enum), assetId?, responsibleParty?, dueDate?, notes? }
- updateRecoveryItem: { id, status?, amount?, notes? }
- createRisk: { projectId, riskType (enum), riskLevel (enum), assetId?, assetTag?, location?, financialExposure?, description?, recommendedAction?, responsibleParty?, dueDate? }
- updateRisk: { id, status?, riskLevel? }
- createActionItem: { projectId, actionType (enum), title, description?, priority (enum), assignedTo?, dueDate? }
- createReport: { projectId, reportType (enum), title, version?, status (enum), storageKey?, storageUrl?, fileName? }
- createMeeting: { projectId, meetingType (enum), title, scheduledDate?, duration?, location?, attendees?, agenda?, summary?, decisions?, actionItems?, status (enum) }
- createBillingItem: { projectId, itemType (enum), description, amount, status (enum), invoiceNumber?, dueDate?, paidDate?, notes? }

## Enum Values
### Recovery Categories
avoided_replacement, sale_disposal, insurance_tax_exposure, maintenance_elimination, licensing_elimination, idle_capital, redeployment, disposal_recommendation, other

### Recovery Status
identified, under_investigation, awaiting_validation, approved, in_progress, realized, rejected, closed

### Risk Types
high_value_missing, no_custodian, uninsured, no_documentation, unauthorized_location, duplicate_purchase, obsolete_equipment, cybersecurity, compliance, pending_decision, other

### Risk Levels
critical, high, medium, low

### Risk Status
open, in_progress, resolved, accepted, escalated

### Action Types
document_approval, question, asset_clarification, milestone_acceptance, change_order, meeting_confirmation, corrective_action, upload_document, other

### Action Priority
urgent, high, normal, low

### Action Status
pending, in_review, approved, rejected, completed, overdue

### Report Types
executive_assessment, verification_analysis, reconciled_far, discrepancy_matrix, inventory_master_log, recovery_register, governance_scorecard, risk_exception_report, location_report, asset_photographs, meeting_summary, final_presentation, technology_plan, quarterly_report, other

### Report Status
draft, in_review, final, superseded

### Meeting Types
kickoff, status_update, review, qbr, ad_hoc, final

### Meeting Status
scheduled, completed, cancelled, rescheduled

### Billing Item Types
invoice, payment, change_order, credit

### Billing Status
pending, sent, paid, overdue, cancelled, approved, rejected

## Phase Schema (projectPhases)
- phaseNumber (1-4), phaseName, status (not_started/in_progress/completed/on_hold)
- completionPercent, startDate, targetEndDate, actualEndDate
- activities (JSON array), milestones (JSON array), deliverables (JSON array)

## KPIs Schema (projectKpis)
- totalAssetsInFar, assetsReviewed, assetsPhysicallyVerified, assetsRemaining
- assetsMatchedToFar, assetsNotFound, assetsFoundNotRecorded, duplicateRecords
- assetsRequiringInvestigation
- estimatedHiddenCapital, verifiedRecoveryOpportunities, potentialAnnualSavings
- openHighRiskExceptions, financialStatus

## Current File Structure
- ClientDashboardManagement.tsx (235 lines) - currently only handles portal access creation
- Need to expand with tabbed sub-panels for: Progress, Recovery, Risks, Tasks, Reports, Meetings, Billing
- AssetManagement.tsx view type: "client-dashboard" renders ClientDashboardManagement

## Colors (shared/colors.ts)
C.charcoal, C.navy, C.slate, C.border, C.text, C.silver, C.textMuted, C.gold
