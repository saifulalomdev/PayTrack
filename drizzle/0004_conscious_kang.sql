CREATE TABLE `installmentTable` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`amount` integer NOT NULL,
	`paid_at` integer NOT NULL,
	`note` text,
	`created_by_name` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customerTable`(`id`) ON UPDATE no action ON DELETE cascade
);
