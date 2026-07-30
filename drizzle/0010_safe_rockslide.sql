CREATE TABLE `clientActionItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`actionType` enum('document_approval','question','asset_clarification','milestone_acceptance','change_order','meeting_confirmation','corrective_action','upload_document','other') NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`priority` enum('urgent','high','normal','low') NOT NULL DEFAULT 'normal',
	`status` enum('pending','in_review','approved','rejected','completed','overdue') NOT NULL DEFAULT 'pending',
	`assignedTo` varchar(255),
	`dueDate` timestamp,
	`completedAt` timestamp,
	`response` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clientActionItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `financialRecovery` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`category` enum('avoided_replacement','sale_disposal','insurance_tax_exposure','maintenance_elimination','licensing_elimination','idle_capital','redeployment','disposal_recommendation','other') NOT NULL,
	`description` text,
	`amount` decimal(14,2) NOT NULL,
	`status` enum('identified','under_investigation','awaiting_validation','approved','in_progress','realized','rejected','closed') NOT NULL DEFAULT 'identified',
	`assetId` int,
	`responsibleParty` varchar(255),
	`dueDate` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `financialRecovery_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectBilling` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`itemType` enum('invoice','payment','change_order','credit') NOT NULL,
	`description` varchar(500) NOT NULL,
	`amount` decimal(14,2) NOT NULL,
	`status` enum('pending','sent','paid','overdue','cancelled','approved','rejected') NOT NULL DEFAULT 'pending',
	`invoiceNumber` varchar(100),
	`dueDate` timestamp,
	`paidDate` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projectBilling_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectKpis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`totalAssetsInFar` int DEFAULT 0,
	`assetsReviewed` int DEFAULT 0,
	`assetsPhysicallyVerified` int DEFAULT 0,
	`assetsRemaining` int DEFAULT 0,
	`assetsMatchedToFar` int DEFAULT 0,
	`assetsNotFound` int DEFAULT 0,
	`assetsFoundNotRecorded` int DEFAULT 0,
	`duplicateRecords` int DEFAULT 0,
	`assetsRequiringInvestigation` int DEFAULT 0,
	`estimatedHiddenCapital` decimal(14,2),
	`verifiedRecoveryOpportunities` decimal(14,2),
	`potentialAnnualSavings` decimal(14,2),
	`openHighRiskExceptions` int DEFAULT 0,
	`financialStatus` enum('preliminary_estimate','under_review','client_validated','approved_for_action','actual_realized') DEFAULT 'preliminary_estimate',
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projectKpis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectMeetings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`meetingType` enum('kickoff','status_update','review','qbr','ad_hoc','final') NOT NULL DEFAULT 'status_update',
	`title` varchar(500) NOT NULL,
	`scheduledDate` timestamp,
	`duration` int,
	`location` varchar(500),
	`attendees` json,
	`agenda` text,
	`summary` text,
	`decisions` json,
	`actionItems` json,
	`status` enum('scheduled','completed','cancelled','rescheduled') NOT NULL DEFAULT 'scheduled',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projectMeetings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectPhases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`phaseNumber` int NOT NULL,
	`phaseName` varchar(255) NOT NULL,
	`status` enum('not_started','in_progress','completed','on_hold') NOT NULL DEFAULT 'not_started',
	`completionPercent` int NOT NULL DEFAULT 0,
	`startDate` timestamp,
	`targetEndDate` timestamp,
	`actualEndDate` timestamp,
	`activities` json,
	`milestones` json,
	`deliverables` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projectPhases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`reportType` enum('executive_assessment','verification_analysis','reconciled_far','discrepancy_matrix','inventory_master_log','recovery_register','governance_scorecard','risk_exception_report','location_report','asset_photographs','meeting_summary','final_presentation','technology_plan','quarterly_report','other') NOT NULL,
	`title` varchar(500) NOT NULL,
	`version` varchar(50) DEFAULT '1.0',
	`status` enum('draft','in_review','final','superseded') NOT NULL DEFAULT 'draft',
	`storageKey` varchar(500),
	`storageUrl` varchar(500),
	`fileName` varchar(500),
	`publishedAt` timestamp,
	`approvedBy` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projectReports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `riskExceptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`riskType` enum('high_value_missing','no_custodian','uninsured','no_documentation','unauthorized_location','duplicate_purchase','obsolete_equipment','cybersecurity','compliance','pending_decision','other') NOT NULL,
	`riskLevel` enum('critical','high','medium','low') NOT NULL DEFAULT 'medium',
	`assetId` int,
	`assetTag` varchar(255),
	`location` varchar(500),
	`financialExposure` decimal(14,2),
	`description` text,
	`recommendedAction` text,
	`responsibleParty` varchar(255),
	`dueDate` timestamp,
	`status` enum('open','in_progress','resolved','accepted','escalated') NOT NULL DEFAULT 'open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `riskExceptions_id` PRIMARY KEY(`id`)
);
