import prisma from '../../../config/database';

export const list = async () => {
  const data = await prisma.codConfig.findMany({ orderBy: { createdAt: 'desc' } });
  return { data };
};

export const create = async (data: any) => {
  return await prisma.$transaction(async (tx) => {
    await tx.codConfig.updateMany({
      where: { orderType: data.orderType, isActive: true },
      data: { isActive: false }
    });
    return tx.codConfig.create({ data: { ...data, isActive: true } });
  });
};

export const update = async (id: string, data: any) => {
  return prisma.codConfig.update({ where: { id }, data });
};
