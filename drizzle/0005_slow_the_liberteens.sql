CREATE TABLE IF NOT EXISTS `event` (
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
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_events_website_time` ON `event` (`website_id`,`timestamp`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_events_session` ON `event` (`session_id`);