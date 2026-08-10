CREATE TABLE `products` (
	`id` text PRIMARY KEY,
	`customer_id` text NOT NULL,
	`product_name` text NOT NULL,
	`total_price` integer NOT NULL,
	`down_payment` integer NOT NULL,
	`installment_amount` integer NOT NULL,
	`installment_deadline` integer NOT NULL,
	`created_by_name` text NOT NULL,
	`created_at` integer NOT NULL,
	CONSTRAINT `fk_products_customer_id_customerTable_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customerTable`(`id`) ON DELETE CASCADE
);
