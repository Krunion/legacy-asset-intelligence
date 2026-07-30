CREATE TABLE `clientPortalAccounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`username` varchar(255) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`clientEmail` varchar(320),
	`clientCompany` varchar(255),
	`dashboardTitle` varchar(500),
	`dashboardConfig` json,
	`isActive` int NOT NULL DEFAULT 1,
	`accessToken` varchar(255),
	`lastLogin` timestamp,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clientPortalAccounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `clientPortalAccounts_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `projectDocuments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`storageKey` varchar(500) NOT NULL,
	`storageUrl` varchar(1000) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`mimeType` varchar(100),
	`fileSize` int,
	`documentType` enum('contract','proposal','report','invoice','correspondence','legal','insurance','other') DEFAULT 'other',
	`description` text,
	`isAdminOnly` int NOT NULL DEFAULT 1,
	`uploadedBy` int NOT NULL,
	`uploadedByName` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projectDocuments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectNotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`content` text NOT NULL,
	`noteType` enum('note','addendum','update','issue','resolution') NOT NULL DEFAULT 'note',
	`isInternal` int NOT NULL DEFAULT 0,
	`createdBy` int NOT NULL,
	`createdByName` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projectNotes_id` PRIMARY KEY(`id`)
);
