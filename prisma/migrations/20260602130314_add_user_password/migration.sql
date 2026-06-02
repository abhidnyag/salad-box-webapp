-- AlterTable
ALTER TABLE `category` MODIFY `icon` VARCHAR(10) NOT NULL DEFAULT '🥗';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `password` VARCHAR(255) NULL;
