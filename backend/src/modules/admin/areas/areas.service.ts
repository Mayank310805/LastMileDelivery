import prisma from '../../../config/database';
import { AppError } from '../../../utils/AppError';

export const list = async (zoneId?: string, page = 1, limit = 10) => {
  const where = zoneId ? { zoneId } : {};
  const [data, total] = await Promise.all([
    prisma.area.findMany({ where, skip: (page - 1) * limit, take: limit }),
    prisma.area.count({ where })
  ]);
  return { data, total, page, limit };
};

export const getById = async (id: string) => {
  const area = await prisma.area.findUnique({ where: { id } });
  if (!area) throw new AppError(404, 'AREA_NOT_FOUND', 'Area not found');
  return area;
};

export const create = async (data: any) => {
  const zone = await prisma.zone.findUnique({ where: { id: data.zoneId } });
  if (!zone) throw new AppError(404, 'ZONE_NOT_FOUND', 'Zone not found');
  const existing = await prisma.area.findUnique({ where: { pincode: data.pincode } });
  if (existing) throw new AppError(409, 'AREA_EXISTS', 'Pincode already exists');
  return prisma.area.create({ data });
};

export const update = async (id: string, data: any) => {
  await getById(id);
  if (data.zoneId) {
    const zone = await prisma.zone.findUnique({ where: { id: data.zoneId } });
    if (!zone) throw new AppError(404, 'ZONE_NOT_FOUND', 'Zone not found');
  }
  if (data.pincode) {
    const existing = await prisma.area.findFirst({
      where: { AND: [{ id: { not: id } }, { pincode: data.pincode }] }
    });
    if (existing) throw new AppError(409, 'AREA_EXISTS', 'Pincode already exists');
  }
  return prisma.area.update({ where: { id }, data });
};

export const remove = async (id: string) => {
  return prisma.area.delete({ where: { id } });
};
