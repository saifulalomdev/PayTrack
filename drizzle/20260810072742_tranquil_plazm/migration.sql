CREATE TABLE `installments` (
	`id` text PRIMARY KEY,
	`product_id` text NOT NULL,
	`amount_paid` integer NOT NULL,
	`paid_at` integer NOT NULL,
	`created_by_name` text NOT NULL,
	`created_at` integer NOT NULL,
	CONSTRAINT `fk_installments_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
DROP TABLE `installmentTable`;