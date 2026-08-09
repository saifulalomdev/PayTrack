PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_customerTable` (
	`id` text PRIMARY KEY,
	`serial_number` text NOT NULL UNIQUE,
	`name` text NOT NULL,
	`created_by_name` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_customerTable`(`id`, `serial_number`, `name`, `created_by_name`, `created_at`) SELECT `id`, `serial_number`, `name`, `created_by_name`, `created_at` FROM `customerTable`;--> statement-breakpoint
DROP TABLE `customerTable`;--> statement-breakpoint
ALTER TABLE `__new_customerTable` RENAME TO `customerTable`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_staffTable` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`password` text NOT NULL,
	`phone_number` text NOT NULL UNIQUE,
	`role` text DEFAULT 'staff' NOT NULL,
	`token_version` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_staffTable`(`id`, `name`, `phone_number`, `password`, `role`, `token_version`, `created_at`) SELECT `id`, `name`, `phone_number`, `password`, `role`, `token_version`, `created_at` FROM `staffTable`;--> statement-breakpoint
DROP TABLE `staffTable`;--> statement-breakpoint
ALTER TABLE `__new_staffTable` RENAME TO `staffTable`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP INDEX IF EXISTS `customerTable_serial_number_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `staffTable_phone_number_unique`;--> statement-breakpoint
ALTER TABLE `installmentTable` DROP COLUMN `paid_at`;