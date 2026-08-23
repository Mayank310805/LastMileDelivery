import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from './auth.validators';
import * as authService from './auth.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/AppError';
import jwt from 'jsonwebtoken';

const setCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registerSchema.parse(req.body);
    const { user, accessToken, refreshToken } = await authService.register(data);
    setCookie(res, refreshToken);
    sendSuccess(res, { user, accessToken }, null, 201);
  } catch (err: any) {
    if (err.name === 'ZodError') {
      next(new AppError(400, 'VALIDATION_ERROR', 'Invalid data', err.format()));
    } else next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = loginSchema.parse(req.body);
    const { user, accessToken, refreshToken } = await authService.login(data.email, data.password);
    setCookie(res, refreshToken);
    sendSuccess(res, { user, accessToken });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      next(new AppError(400, 'VALIDATION_ERROR', 'Invalid data', err.format()));
    } else next(err);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new AppError(401, 'UNAUTHORIZED', 'No refresh token provided.');
    
    const { accessToken, refreshToken } = await authService.refresh(token);
    setCookie(res, refreshToken);
    sendSuccess(res, { accessToken });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const decoded: any = jwt.decode(token);
      if (decoded && decoded.tokenId && decoded.userId) {
        await authService.logout(decoded.tokenId, decoded.userId);
      }
    }
    res.clearCookie('refreshToken');
    sendSuccess(res, { message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getProfile((req as any).user.id);
    sendSuccess(res, user);
  } catch (err) {
    next(err);
  }
};
