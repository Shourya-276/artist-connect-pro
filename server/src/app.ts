import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/auth.routes.js';
import metadataRoutes from './routes/metadata.routes.js';
import artistRoutes from './routes/artist.routes.js';
import clientRoutes from './routes/client.routes.js';
import mediaRoutes from './routes/media.routes.js';
import reviewRoutes from './routes/review.routes.js';

// Load env vars
dotenv.config();

const app: Application = express();

// Middlewares
// Disable some helmet defaults that can block local development CORS
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Explicitly allow all origins for deployment testing
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(compression());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(morgan('dev'));

// Static files (local fallback for AWS)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/metadata', metadataRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/reviews', reviewRoutes);

// Basic health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', message: 'Artist Connect Pro API is running' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

export default app;
