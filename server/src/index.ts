import 'dotenv/config';
import app from './app.js';
import prisma from './config/db.js';

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Connected to MySQL database via Prisma');
    
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
