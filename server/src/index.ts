import 'dotenv/config';
import app from './app.js';
import prisma from './config/db.js';

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Connected to MySQL database via Prisma');

    // Self-healing check: Ensure reviewerName column exists in Review table
    try {
      await prisma.$executeRawUnsafe(
        "ALTER TABLE `Review` ADD COLUMN `reviewerName` VARCHAR(191) NULL"
      );
      console.log('✅ Self-healing: Added missing reviewerName column to Review table');
    } catch (e: any) {
      // Ignore if column already exists (MySQL error 1060: Duplicate column name)
      if (e.message && e.message.includes('1060')) {
        console.log('ℹ️ Review table already has reviewerName column');
      } else {
        console.warn('⚠️ Self-healing: Warning checking/adding reviewerName column:', e.message);
      }
    }

    // Self-healing check: Ensure clientId column in Review is nullable (was NOT NULL in early migrations)
    try {
      await prisma.$executeRawUnsafe(
        "ALTER TABLE `Review` MODIFY COLUMN `clientId` VARCHAR(191) NULL"
      );
      console.log('✅ Self-healing: Ensured clientId in Review table is nullable');
    } catch (e: any) {
      console.warn('⚠️ Self-healing: Warning modifying clientId column nullability:', e.message);
    }
    
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
