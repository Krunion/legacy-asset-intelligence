ALTER TABLE `assets` ADD `isReusableClientTag` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `assets` ADD `clientBarcodeValue` varchar(500);