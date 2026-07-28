CREATE TABLE `staffTable` (
	`id` text PRIMARY KEY NOT NULL,
	`id_card_number` text NOT NULL,
	`name` text NOT NULL,
	`phone_number` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'staff' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `staffTable_id_card_number_unique` ON `staffTable` (`id_card_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `staffTable_phone_number_unique` ON `staffTable` (`phone_number`);