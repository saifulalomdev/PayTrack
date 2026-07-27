ALTER TABLE `event` ADD `url` text NOT NULL DEFAULT 'https://saifulalom.com/';
ALTER TABLE `event` DROP COLUMN `path`;