import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/response';
import { env } from '../config/env';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return sendError(res, err.code, err.message, err.statusCode, err.fields);
  }
  
  console.error('Unhandled Error:', err);
  
  const message = env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  return sendError(res, 'INTERNAL_ERROR', message, 500);
};
