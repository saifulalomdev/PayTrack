DROP INDEX `staffTable_id_card_number_unique`;--> statement-breakpoint
ALTER TABLE `staffTable` ADD `password` text NOT NULL;--> statement-breakpoint
ALTER TABLE `staffTable` DROP COLUMN `id_card_number`;--> statement-breakpoint
ALTER TABLE `staffTable` DROP COLUMN `password_hash`;