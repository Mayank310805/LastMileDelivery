import prisma from '../../config/database';
import { AppError } from '../../utils/AppError';

export async function resolveZone(pincode: string) {
  const area = await prisma.area.findUnique({
    where: { pincode },
    include: { zone: true }
  });
  if (!area || !area.zone) {
    throw new AppError(409, 'ZONE_NOT_CONFIGURED', `No zone configured for pincode ${pincode}`);
  }
  return { area, zone: area.zone };
}
