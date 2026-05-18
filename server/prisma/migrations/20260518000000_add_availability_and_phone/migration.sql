-- AlterTable
ALTER TABLE `ArtistProfile` ADD COLUMN `availability` JSON NULL;

-- AlterTable
ALTER TABLE `Lead` ADD COLUMN `phone` VARCHAR(191) NULL;
