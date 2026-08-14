CREATE TABLE `fines` (
	`id` text PRIMARY KEY,
	`product_id` text NOT NULL,
	`amount` integer NOT NULL,
	`note` text NOT NULL,
	`created_by_name` text NOT NULL,
	`created_at` integer NOT NULL,
	CONSTRAINT `fk_fines_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
);
