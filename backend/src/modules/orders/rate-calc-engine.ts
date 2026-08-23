import prisma from '../../config/database';
import { AppError } from '../../utils/AppError';
import { resolveZone } from './zone-detection';

export interface RateCalculationInput {
  pickupPincode?: string;
  dropPincode?: string;
  pickupAddress?: { pincode: string };
  dropAddress?: { pincode: string };
  lengthCm: number;
  breadthCm: number;
  heightCm: number;
  actualWeightKg: number;
  orderType: 'B2B' | 'B2C';
  paymentType: 'PREPAID' | 'COD';
}

export interface RateCalculationResult {
  pickupZoneId: string;
  dropZoneId: string;
  pickupZoneName: string;
  dropZoneName: string;
  zoneRelation: 'INTRA' | 'INTER';
  volumetricWeightKg: number;
  billableWeightKg: number;
  baseCharge: number;
  codSurcharge: number;
  totalCharge: number;
  rateCardId: string;
}

export async function calculateRate(input: RateCalculationInput): Promise<RateCalculationResult> {
  const pickupPincode = input.pickupPincode || input.pickupAddress?.pincode;
  const dropPincode = input.dropPincode || input.dropAddress?.pincode;
  if (!pickupPincode || !dropPincode) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Pickup and drop pincodes are required');
  }

  const pickup = await resolveZone(pickupPincode);
  const drop = await resolveZone(dropPincode);

  const zoneRelation = pickup.zone.id === drop.zone.id ? 'INTRA' : 'INTER';
  const volumetricWeightKg = Number(((input.lengthCm * input.breadthCm * input.heightCm) / 5000).toFixed(3));
  const billableWeightKg = Number(Math.max(input.actualWeightKg, volumetricWeightKg).toFixed(3));

  const rateCard = await prisma.rateCard.findFirst({
    where: { orderType: input.orderType, zoneRelation, isActive: true }
  });

  if (!rateCard) {
    throw new AppError(409, 'RATE_NOT_CONFIGURED', 'Rate not configured for this route');
  }

  let baseCharge = rateCard.basePrice;
  if (billableWeightKg > rateCard.baseWeightKg) {
    baseCharge += (billableWeightKg - rateCard.baseWeightKg) * rateCard.additionalPricePerKg;
  }
  baseCharge = Math.max(baseCharge, rateCard.minCharge);

  let codSurcharge = 0;
  if (input.paymentType === 'COD') {
    const codConfig = await prisma.codConfig.findFirst({
      where: { orderType: input.orderType, isActive: true }
    });
    if (!codConfig) throw new AppError(409, 'COD_NOT_CONFIGURED', 'COD configuration not found');
    
    if (codConfig.surchargeType === 'FLAT') {
      codSurcharge = codConfig.value;
    } else {
      codSurcharge = Math.max((baseCharge * codConfig.value) / 100, codConfig.minCharge);
    }
  }

  const totalCharge = Number((baseCharge + codSurcharge).toFixed(2));

  return {
    pickupZoneId: pickup.zone.id,
    dropZoneId: drop.zone.id,
    pickupZoneName: pickup.zone.name,
    dropZoneName: drop.zone.name,
    zoneRelation,
    volumetricWeightKg,
    billableWeightKg,
    baseCharge,
    codSurcharge,
    totalCharge,
    rateCardId: rateCard.id
  };
}
