import 'dotenv/config';
import app from './app.js';
import prisma from './config/db.js';

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Connected to MySQL database via Prisma');

    // ──────────────────────────────────────────────────────────────
    // COMPREHENSIVE SELF-HEALING: Sync production DB schema
    // Adds all columns/tables that exist in schema.prisma but may
    // be missing from the production database due to unapplied migrations.
    // Each ALTER is wrapped in its own try/catch so failures (e.g.
    // "Duplicate column") are silently ignored and don't block startup.
    // ──────────────────────────────────────────────────────────────
    const safeAlter = async (description: string, sql: string) => {
      try {
        await prisma.$executeRawUnsafe(sql);
        console.log(`✅ Self-heal: ${description}`);
      } catch (e: any) {
        // 1060 = Duplicate column, 1050 = Table already exists, 1061 = Duplicate key
        if (e.message && (e.message.includes('1060') || e.message.includes('1050') || e.message.includes('1061'))) {
          // Already exists — no action needed
        } else {
          console.warn(`⚠️ Self-heal (${description}):`, e.message);
        }
      }
    };

    console.log('🔧 Running database self-healing checks...');

    // --- ArtistProfile: columns added after initial migration ---
    await safeAlter('ArtistProfile.coverImage',       "ALTER TABLE `ArtistProfile` ADD COLUMN `coverImage` VARCHAR(191) NULL");
    await safeAlter('ArtistProfile.isTopSeller',       "ALTER TABLE `ArtistProfile` ADD COLUMN `isTopSeller` BOOLEAN NOT NULL DEFAULT false");
    await safeAlter('ArtistProfile.isTrending',        "ALTER TABLE `ArtistProfile` ADD COLUMN `isTrending` BOOLEAN NOT NULL DEFAULT false");
    await safeAlter('ArtistProfile.area',              "ALTER TABLE `ArtistProfile` ADD COLUMN `area` VARCHAR(191) NULL");
    await safeAlter('ArtistProfile.budgetChart',       "ALTER TABLE `ArtistProfile` ADD COLUMN `budgetChart` JSON NULL");
    await safeAlter('ArtistProfile.eventCategories',   "ALTER TABLE `ArtistProfile` ADD COLUMN `eventCategories` JSON NULL");
    await safeAlter('ArtistProfile.facebook',          "ALTER TABLE `ArtistProfile` ADD COLUMN `facebook` VARCHAR(191) NULL");
    await safeAlter('ArtistProfile.gender',            "ALTER TABLE `ArtistProfile` ADD COLUMN `gender` VARCHAR(191) NULL");
    await safeAlter('ArtistProfile.instagram',         "ALTER TABLE `ArtistProfile` ADD COLUMN `instagram` VARCHAR(191) NULL");
    await safeAlter('ArtistProfile.instruments',       "ALTER TABLE `ArtistProfile` ADD COLUMN `instruments` JSON NULL");
    await safeAlter('ArtistProfile.languages',         "ALTER TABLE `ArtistProfile` ADD COLUMN `languages` JSON NULL");
    await safeAlter('ArtistProfile.phone',             "ALTER TABLE `ArtistProfile` ADD COLUMN `phone` VARCHAR(191) NULL");
    await safeAlter('ArtistProfile.website',           "ALTER TABLE `ArtistProfile` ADD COLUMN `website` VARCHAR(191) NULL");
    await safeAlter('ArtistProfile.youtube',           "ALTER TABLE `ArtistProfile` ADD COLUMN `youtube` VARCHAR(191) NULL");
    await safeAlter('ArtistProfile.availability',      "ALTER TABLE `ArtistProfile` ADD COLUMN `availability` JSON NULL");

    // --- Booking: hasBeenReviewed column ---
    await safeAlter('Booking.hasBeenReviewed',         "ALTER TABLE `Booking` ADD COLUMN `hasBeenReviewed` BOOLEAN NOT NULL DEFAULT false");

    // --- Review: reviewerName column + clientId nullable ---
    await safeAlter('Review.reviewerName',             "ALTER TABLE `Review` ADD COLUMN `reviewerName` VARCHAR(191) NULL");
    await safeAlter('Review.clientId nullable',        "ALTER TABLE `Review` MODIFY COLUMN `clientId` VARCHAR(191) NULL");

    // --- Review: Update foreign key constraints to CASCADE ---
    // Drop old RESTRICT constraints and re-add as CASCADE
    await safeAlter('Review FK artistId drop',         "ALTER TABLE `Review` DROP FOREIGN KEY `Review_artistId_fkey`");
    await safeAlter('Review FK artistId cascade',      "ALTER TABLE `Review` ADD CONSTRAINT `Review_artistId_fkey` FOREIGN KEY (`artistId`) REFERENCES `ArtistProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
    await safeAlter('Review FK clientId drop',         "ALTER TABLE `Review` DROP FOREIGN KEY `Review_clientId_fkey`");
    await safeAlter('Review FK clientId cascade',      "ALTER TABLE `Review` ADD CONSTRAINT `Review_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `ClientProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");

    // --- Lead table (may not exist at all in production) ---
    await safeAlter('Create Lead table', `
      CREATE TABLE \`Lead\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`name\` VARCHAR(191) NOT NULL,
        \`email\` VARCHAR(191) NOT NULL,
        \`phone\` VARCHAR(191) NULL,
        \`message\` TEXT NOT NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);
    // If Lead table already existed but without phone column
    await safeAlter('Lead.phone',  "ALTER TABLE `Lead` ADD COLUMN `phone` VARCHAR(191) NULL");

    console.log('✅ Database self-healing checks complete.');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error: any) {
    console.error('❌ Database connection failed! Waiting for fixes...');
    console.error(`Error: ${error.message}`);
    // We DON'T do process.exit(1) here.
    // This allows the watch mode to stay alive and restart when you fix the .env file!
  }
};

startServer();
