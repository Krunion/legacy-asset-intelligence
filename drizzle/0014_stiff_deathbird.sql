CREATE TABLE `pmNotifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`recipientName` varchar(255),
	`notificationType` enum('task_response','document_uploaded','billing_update','milestone_update','risk_escalation','general') NOT NULL DEFAULT 'general',
	`title` varchar(500) NOT NULL,
	`message` text NOT NULL,
	`relatedEntityType` varchar(100),
	`relatedEntityId` int,
	`isRead` int NOT NULL DEFAULT 0,
	`isAcknowledged` int NOT NULL DEFAULT 0,
	`emailSent` int NOT NULL DEFAULT 0,
	`emailSentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pmNotifications_id` PRIMARY KEY(`id`)
);
