ALTER TABLE `clientPortalAccounts` ADD `failedLoginAttempts` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `clientPortalAccounts` ADD `lockedUntil` timestamp;