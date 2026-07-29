CREATE TABLE `assetCategories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`parentId` int,
	`color` varchar(7),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assetCategories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assetDocuments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assetId` int NOT NULL,
	`storageKey` varchar(500) NOT NULL,
	`storageUrl` varchar(1000) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`mimeType` varchar(100),
	`fileSize` int,
	`documentType` enum('warranty','manual','invoice','receipt','maintenance_record','other') DEFAULT 'other',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assetDocuments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assetPhotos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assetId` int NOT NULL,
	`storageKey` varchar(500) NOT NULL,
	`storageUrl` varchar(1000) NOT NULL,
	`fileName` varchar(255),
	`mimeType` varchar(100),
	`fileSize` int,
	`caption` text,
	`isPrimary` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assetPhotos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assetTag` varchar(100) NOT NULL,
	`name` varchar(500) NOT NULL,
	`description` text,
	`categoryId` int,
	`status` enum('active','inactive','disposed','in_repair','lost','transferred') NOT NULL DEFAULT 'active',
	`condition` enum('new','excellent','good','fair','poor','salvage') NOT NULL DEFAULT 'good',
	`manufacturer` varchar(255),
	`model` varchar(255),
	`serialNumber` varchar(255),
	`location` varchar(500),
	`building` varchar(255),
	`floor` varchar(50),
	`room` varchar(100),
	`department` varchar(255),
	`assignedTo` varchar(255),
	`custodian` varchar(255),
	`acquisitionDate` timestamp,
	`acquisitionCost` decimal(12,2),
	`currentValue` decimal(12,2),
	`salvageValue` decimal(12,2),
	`usefulLifeYears` int,
	`warrantyExpiration` timestamp,
	`lastMaintenanceDate` timestamp,
	`nextMaintenanceDate` timestamp,
	`maintenanceNotes` text,
	`quantity` int NOT NULL DEFAULT 1,
	`unitOfMeasure` varchar(50) DEFAULT 'each',
	`barcodeType` enum('code128','code39','qr') DEFAULT 'code128',
	`barcodeValue` varchar(255),
	`customFields` json,
	`notes` text,
	`createdBy` int,
	`updatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assets_id` PRIMARY KEY(`id`),
	CONSTRAINT `assets_assetTag_unique` UNIQUE(`assetTag`)
);
