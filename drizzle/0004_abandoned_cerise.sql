ALTER TABLE `assets` MODIFY COLUMN `status` enum('active','inactive','disposed','in_repair','lost','transferred','dam_op','dam_inop') NOT NULL DEFAULT 'active';--> statement-breakpoint
ALTER TABLE `assets` MODIFY COLUMN `barcodeType` varchar(50) DEFAULT 'code128';--> statement-breakpoint
ALTER TABLE `assets` ADD `addressStreet` varchar(500);--> statement-breakpoint
ALTER TABLE `assets` ADD `addressCity` varchar(255);--> statement-breakpoint
ALTER TABLE `assets` ADD `addressState` varchar(100);--> statement-breakpoint
ALTER TABLE `assets` ADD `addressZip` varchar(20);--> statement-breakpoint
ALTER TABLE `assets` ADD `parentAssetTag` varchar(100);