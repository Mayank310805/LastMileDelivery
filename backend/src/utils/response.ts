import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, meta?: any, statusCode = 200) => {
  res.status(statusCode).json({ data, meta });
};

export const sendError = (res: Response, code: string, message: string, statusCode = 400, fields?: Record<string, string>) => {
  res.status(statusCode).json({
    error: {
      code,
      message,
      fields
    }
  });
};
