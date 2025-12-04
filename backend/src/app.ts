import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import guestsRouter from './routes/guests.js';
import contributionsRouter from './routes/contributions.js';
import statsRouter from './routes/stats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();
  const isProduction = process.env.NODE_ENV === 'production';
  const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

  // Middleware
  app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }));
  app.use(express.json());

  // Rate limiting simple (60 req/min par IP)
  const requestCounts = new Map<string, { count: number; resetTime: number }>();

  app.use((req, res, next) => {
    // Désactiver rate limiting en test
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    const ip = req.ip || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000;
    const maxRequests = 60;

    const record = requestCounts.get(ip);

    if (!record || now > record.resetTime) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    } else if (record.count >= maxRequests) {
      res.status(429).json({
        success: false,
        error: 'Trop de requêtes. Veuillez réessayer dans quelques instants.',
      });
      return;
    } else {
      record.count++;
    }

    next();
  });

  // Routes
  app.use('/api/guests', guestsRouter);
  app.use('/api/contributions', contributionsRouter);
  app.use('/api/stats', statsRouter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Serve frontend in production
  if (isProduction) {
    const frontendPath = path.join(__dirname, '../../public');
    app.use(express.static(frontendPath));

    // SPA fallback - serve index.html for all non-API routes
    app.use((req, res, next) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(frontendPath, 'index.html'));
      } else {
        next();
      }
    });
  }

  // Error handler global
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Erreur:', err);
    res.status(500).json({
      success: false,
      error: 'Une erreur interne est survenue',
    });
  });

  return app;
}

export default createApp;
