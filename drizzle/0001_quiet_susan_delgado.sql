CREATE TABLE `contactSubmissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(255),
	`lastName` varchar(255),
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`company` varchar(255),
	`message` text,
	`source` enum('contact_form','roi_calculator','chatbot') NOT NULL,
	`emailSent` int NOT NULL DEFAULT 0,
	`emailError` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contactSubmissions_id` PRIMARY KEY(`id`)
);
