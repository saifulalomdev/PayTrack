CREATE TABLE `customerTable` (
	`id` text PRIMARY KEY NOT NULL,
	`serial_number` text NOT NULL,
	`name` text NOT NULL,
	`product_name` text NOT NULL,
	`total_price` integer NOT NULL,
	`down_payment` integer NOT NULL,
	`installment_amount` integer NOT NULL,
	`installment_deadline` integer NOT NULL,
	`created_by_name` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customerTable_serial_number_unique` ON `customerTable` (`serial_number`);