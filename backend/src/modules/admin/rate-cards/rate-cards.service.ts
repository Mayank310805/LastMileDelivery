import prisma from '../../../config/database';

export const list = async () => {
  const data = await prisma.rateCard.findMany({ orderBy: { createdAt: 'desc' } });
  return { data };
};

export const create = async (data: any) => {
  return await prisma.$transaction(async (tx) => {
    await tx.rateCard.updateMany({
      where: { orderType: data.orderType, zoneRelation: data.zoneRelation, isActive: true },
      data: { isActive: false }
    });
    return tx.rateCard.create({ data: { ...data, isActive: true } });
  });
};

export const update = async (id: string, data: any) => {
  return prisma.rateCard.update({ where: { id }, data });
};
