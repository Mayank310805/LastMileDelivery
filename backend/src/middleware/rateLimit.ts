import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

// A simple in-memory rate limiter for auth endpoints
const rateLimitCache = new Map<string, { count: number; timestamp: number }>();

export const authRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const max = 20; // limit each IP to 20 auth requests per window

  const record = rateLimitCache.get(ip);
  if (!record) {
    rateLimitCache.set(ip, { count: 1, timestamp: now });
  } else {
    if (now - record.timestamp > windowMs) {
      rateLimitCache.set(ip, { count: 1, timestamp: now });
    } else {
      record.count++;
      if (record.count > max) {
        return next(new AppError(429, 'RATE_LIMIT_EXCEEDED', 'Too many requests, please try again later.'));
      }
    }
  }
  next();
};
