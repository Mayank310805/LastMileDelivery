import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import prisma from '../../config/database';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import { v4 as uuidv4 } from 'uuid';


const generateTokens = (user: User) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_ACCESS_SECRET as string,
    { expiresIn: env.JWT_ACCESS_EXPIRY as any }
  );

  const tokenId = uuidv4();
  const refreshToken = jwt.sign(
    { tokenId, userId: user.id },
    env.JWT_REFRESH_SECRET as string,
    { expiresIn: env.JWT_REFRESH_EXPIRY as any }
  );

  return { accessToken, refreshToken, tokenId };
};

export const register = async (data: any) => {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email: data.email }, { phone: data.phone }] }
  });

  if (existingUser) {
    throw new AppError(400, 'USER_EXISTS', 'User with this email or phone already exists.');
  }

  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      role: 'CUSTOMER'
    }
  });

  const tokens = generateTokens(user);
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
  }

  const tokens = generateTokens(user);
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens };
};

export const refresh = async (token: string) => {
  try {
    const decoded: any = jwt.verify(token, env.JWT_REFRESH_SECRET);
    
    const denied = await prisma.refreshToken.findUnique({ where: { tokenId: decoded.tokenId } });
    if (denied) throw new Error('Token denied');

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) throw new Error('User not found');

    // Rotate token
    await prisma.refreshToken.create({
      data: { tokenId: decoded.tokenId, userId: user.id, expiresAt: new Date() }
    });

    const tokens = generateTokens(user);
    return tokens;
  } catch (error) {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid or expired refresh token.');
  }
};

export const logout = async (tokenId: string, userId: string) => {
  await prisma.refreshToken.create({
    data: { tokenId, userId, expiresAt: new Date() }
  });
};

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, phone: true, role: true, isActive: true, createdAt: true }
  });
  if (!user) throw new AppError(404, 'NOT_FOUND', 'User not found.');
  return user;
};
