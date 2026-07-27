PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_event` (
	`id` text PRIMARY KEY NOT NULL,
	`website_id` text NOT NULL,
	`session_id` text NOT NULL,
	`path` text NOT NULL,
	`page_title` text NOT NULL,
	`event_type` text NOT NULL,
	`event_value` real,
	`event_currency` text,
	`screen_width` integer,
	`screen_height` integer,
	`lang` text,
	`platform` text,
	`country` text,
	`params` text,
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`website_id`) REFERENCES `site`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_event`("id", "website_id", "session_id", "path", "page_title", "event_type", "event_value", "event_currency", "screen_width", "screen_height", "lang", "platform", "country", "params", "timestamp") SELECT "id", "website_id", "session_id", "path", "page_title", "event_type", "event_value", "event_currency", "screen_width", "screen_height", "lang", "platform", "country", "params", "timestamp" FROM `event`;--> statement-breakpoint
DROP TABLE `event`;--> statement-breakpoint
ALTER TABLE `__new_event` RENAME TO `event`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_events_website_time` ON `event` (`website_id`,`timestamp`);--> statement-breakpoint
CREATE INDEX `idx_events_session` ON `event` (`session_id`);