CREATE TABLE `site` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`is_active` integer DEFAULT true
);
--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
DROP TABLE `account`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
DROP TABLE `verification`;