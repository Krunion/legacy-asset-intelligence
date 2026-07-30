CREATE TABLE `assetProjects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(500) NOT NULL,
	`description` text,
	`clientName` varchar(255),
	`clientContact` varchar(255),
	`location` varchar(500),
	`status` enum('active','completed','archived','on_hold') NOT NULL DEFAULT 'active',
	`assetCount` int NOT NULL DEFAULT 0,
	`totalValue` decimal(14,2) DEFAULT '0',
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assetProjects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `assets` ADD `projectId` int NOT NULL;