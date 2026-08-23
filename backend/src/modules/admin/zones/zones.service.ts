import prisma from '../../../config/database';
import { AppError } from '../../../utils/AppError';

export const list = async (search?: string, page = 1, limit = 10) => {
  const where = search ? { OR: [{ name: { contains: search } }, { code: { contains: search } }] } : {};
  const [data, total] = await Promise.all([
    prisma.zone.findMany({ where, skip: (page - 1) * limit, take: limit }),
    prisma.zone.count({ where })
  ]);
  return { data, total, page, limit };
};

export const getById = async (id: string) => {
  const zone = await prisma.zone.findUnique({ where: { id } });
  if (!zone) throw new AppError(404, 'ZONE_NOT_FOUND', 'Zone not found');
  return zone;
};

export const create = async (data: any) => {
  const existing = await prisma.zone.findFirst({ where: { OR: [{ name: data.name }, { code: data.code }] } });
  if (existing) throw new AppError(409, 'ZONE_EXISTS', 'Zone name or code already exists');
  return prisma.zone.create({ data });
};

export const update = async (id: string, data: any) => {
  await getById(id);
  if (data.name || data.code) {
    const existing = await prisma.zone.findFirst({
      where: { AND: [{ id: { not: id } }, { OR: [{ name: data.name }, { code: data.code }] }] }
    });
    if (existing) throw new AppError(409, 'ZONE_EXISTS', 'Zone name or code already exists');
  }
  return prisma.zone.update({ where: { id }, data });
};

export const remove = async (id: string) => {
  const areaCount = await prisma.area.count({ where: { zoneId: id } });
  if (areaCount > 0) throw new AppError(409, 'ZONE_IN_USE', 'Cannot delete zone referenced by areas');
  return prisma.zone.delete({ where: { id } });
};
