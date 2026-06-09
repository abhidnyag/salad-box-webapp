-- AlterTable
ALTER TABLE `Category` MODIFY `icon` VARCHAR(10) NOT NULL DEFAULT '🥗';

-- AlterTable
ALTER TABLE `User` ADD COLUMN `password` VARCHAR(255) NULL;
