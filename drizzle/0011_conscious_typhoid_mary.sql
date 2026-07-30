CREATE TABLE `auditHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityType` enum('billing','document','risk','recovery','meeting','report','action_item','asset','photo','project','client_access','user') NOT NULL,
	`entityId` int NOT NULL,
	`projectId` int,
	`action` enum('create','update','delete','archive','restore','visibility_change','status_change','access_grant','access_revoke') NOT NULL,
	`changedBy` int,
	`changedByName` varchar(255),
	`previousValues` json,
	`newValues` json,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `financialRecovery` MODIFY COLUMN `status` enum('identified','under_review','verified','client_decision_required','approved','in_progress','realized','rejected','closed') NOT NULL DEFAULT 'identified';--> statement-breakpoint
ALTER TABLE `projectBilling` MODIFY COLUMN `status` enum('draft','upcoming','due','sent','partially_paid','paid','past_due','overdue','cancelled','disputed','pending','approved','rejected') NOT NULL DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE `projectDocuments` MODIFY COLUMN `documentType` enum('contract','proposal','report','invoice','correspondence','legal','insurance','assessment','meeting_document','project_deliverable','supporting_document','other') DEFAULT 'other';--> statement-breakpoint
ALTER TABLE `projectMeetings` MODIFY COLUMN `meetingType` enum('kickoff','status_update','review','qbr','ad_hoc','final','message') NOT NULL DEFAULT 'status_update';--> statement-breakpoint
ALTER TABLE `riskExceptions` MODIFY COLUMN `riskType` enum('high_value_missing','no_custodian','uninsured','no_documentation','unauthorized_location','duplicate_purchase','obsolete_equipment','cybersecurity','compliance','pending_decision','risk','exception','assessment','finding','other') NOT NULL;--> statement-breakpoint
ALTER TABLE `riskExceptions` MODIFY COLUMN `status` enum('open','under_review','mitigation_in_progress','in_progress','resolved','closed','accepted','escalated') NOT NULL DEFAULT 'open';--> statement-breakpoint
ALTER TABLE `financialRecovery` ADD `title` varchar(500);--> statement-breakpoint
ALTER TABLE `financialRecovery` ADD `estimatedValue` decimal(14,2);--> statement-breakpoint
ALTER TABLE `financialRecovery` ADD `verifiedValue` decimal(14,2);--> statement-breakpoint
ALTER TABLE `financialRecovery` ADD `realizedValue` decimal(14,2);--> statement-breakpoint
ALTER TABLE `financialRecovery` ADD `owner` varchar(255);--> statement-breakpoint
ALTER TABLE `financialRecovery` ADD `dateIdentified` timestamp;--> statement-breakpoint
ALTER TABLE `financialRecovery` ADD `targetCompletionDate` timestamp;--> statement-breakpoint
ALTER TABLE `financialRecovery` ADD `recommendedAction` text;--> statement-breakpoint
ALTER TABLE `financialRecovery` ADD `isClientVisible` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `financialRecovery` ADD `createdBy` int;--> statement-breakpoint
ALTER TABLE `financialRecovery` ADD `updatedBy` int;--> statement-breakpoint
ALTER TABLE `projectBilling` ADD `amountPaid` decimal(14,2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `projectBilling` ADD `remainingBalance` decimal(14,2);--> statement-breakpoint
ALTER TABLE `projectBilling` ADD `billingPeriod` varchar(255);--> statement-breakpoint
ALTER TABLE `projectBilling` ADD `invoiceDate` timestamp;--> statement-breakpoint
ALTER TABLE `projectBilling` ADD `paymentReceivedDate` timestamp;--> statement-breakpoint
ALTER TABLE `projectBilling` ADD `nextPaymentDate` timestamp;--> statement-breakpoint
ALTER TABLE `projectBilling` ADD `nextPaymentAmount` decimal(14,2);--> statement-breakpoint
ALTER TABLE `projectBilling` ADD `pastDueAmount` decimal(14,2);--> statement-breakpoint
ALTER TABLE `projectBilling` ADD `storageKey` varchar(500);--> statement-breakpoint
ALTER TABLE `projectBilling` ADD `storageUrl` varchar(1000);--> statement-breakpoint
ALTER TABLE `projectBilling` ADD `fileName` varchar(255);--> statement-breakpoint
ALTER TABLE `projectBilling` ADD `isClientVisible` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `projectBilling` ADD `createdBy` int;--> statement-breakpoint
ALTER TABLE `projectBilling` ADD `updatedBy` int;--> statement-breakpoint
ALTER TABLE `projectDocuments` ADD `isClientVisible` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `projectDocuments` ADD `updatedAt` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `projectMeetings` ADD `followUpAction` text;--> statement-breakpoint
ALTER TABLE `projectMeetings` ADD `followUpDueDate` timestamp;--> statement-breakpoint
ALTER TABLE `projectMeetings` ADD `attachmentStorageKey` varchar(500);--> statement-breakpoint
ALTER TABLE `projectMeetings` ADD `attachmentStorageUrl` varchar(1000);--> statement-breakpoint
ALTER TABLE `projectMeetings` ADD `attachmentFileName` varchar(255);--> statement-breakpoint
ALTER TABLE `projectMeetings` ADD `isClientVisible` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `projectMeetings` ADD `createdBy` int;--> statement-breakpoint
ALTER TABLE `projectMeetings` ADD `updatedBy` int;--> statement-breakpoint
ALTER TABLE `riskExceptions` ADD `title` varchar(500);--> statement-breakpoint
ALTER TABLE `riskExceptions` ADD `severity` enum('critical','high','moderate','low') DEFAULT 'moderate';--> statement-breakpoint
ALTER TABLE `riskExceptions` ADD `owner` varchar(255);--> statement-breakpoint
ALTER TABLE `riskExceptions` ADD `identifiedDate` timestamp;--> statement-breakpoint
ALTER TABLE `riskExceptions` ADD `targetResolutionDate` timestamp;--> statement-breakpoint
ALTER TABLE `riskExceptions` ADD `resolutionNotes` text;--> statement-breakpoint
ALTER TABLE `riskExceptions` ADD `isClientVisible` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `riskExceptions` ADD `createdBy` int;--> statement-breakpoint
ALTER TABLE `riskExceptions` ADD `updatedBy` int;