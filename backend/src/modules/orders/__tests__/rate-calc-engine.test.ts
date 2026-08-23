import { calculateRate } from '../rate-calc-engine';
import { resolveZone } from '../zone-detection';
import prisma from '../../../config/database';

jest.mock('../zone-detection');
jest.mock('../../../config/database', () => ({
  __esModule: true,
  default: {
    rateCard: { findFirst: jest.fn() },
    codConfig: { findFirst: jest.fn() }
  }
}));

describe('Rate Calculation Engine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calculates volumetric weight correctly and uses actual weight when higher', async () => {
    (resolveZone as jest.Mock).mockImplementation(async (pincode) => {
      return { zone: { id: `zone-${pincode}`, name: 'Zone A' } };
    });

    (prisma.rateCard.findFirst as jest.Mock).mockResolvedValue({
      id: 'rc-1',
      basePrice: 100,
      baseWeightKg: 1,
      additionalPricePerKg: 50,
      minCharge: 100
    });

    // 30x20x15 = 9000 / 5000 = 1.8kg volumetric
    // actual weight = 2.0kg -> billable weight should be 2.0kg
    const result = await calculateRate({
      pickupPincode: '111',
      dropPincode: '222',
      lengthCm: 30,
      breadthCm: 20,
      heightCm: 15,
      actualWeightKg: 2.0,
      orderType: 'B2C',
      paymentType: 'PREPAID'
    });

    expect(result.volumetricWeightKg).toBe(1.8);
    expect(result.billableWeightKg).toBe(2.0);
    // Base weight is 1. Billable is 2. (2 - 1) * 50 = 50. Total base = 100 + 50 = 150
    expect(result.baseCharge).toBe(150);
    expect(result.totalCharge).toBe(150);
  });

  it('uses volumetric weight when it is higher than actual', async () => {
    (resolveZone as jest.Mock).mockImplementation(async () => ({ zone: { id: 'z1', name: 'Z1' } }));
    
    (prisma.rateCard.findFirst as jest.Mock).mockResolvedValue({
      id: 'rc-1',
      basePrice: 200,
      baseWeightKg: 5,
      additionalPricePerKg: 10,
      minCharge: 200
    });

    // 50x40x30 = 60000 / 5000 = 12.0kg volumetric
    // actual weight = 4.0kg -> billable weight = 12.0kg
    const result = await calculateRate({
      pickupPincode: '111',
      dropPincode: '222',
      lengthCm: 50,
      breadthCm: 40,
      heightCm: 30,
      actualWeightKg: 4.0,
      orderType: 'B2B',
      paymentType: 'PREPAID'
    });

    expect(result.volumetricWeightKg).toBe(12.0);
    expect(result.billableWeightKg).toBe(12.0);
    // Base weight is 5. Billable is 12. (12 - 5) * 10 = 70. Total base = 200 + 70 = 270
    expect(result.totalCharge).toBe(270);
  });

  it('applies percentage COD surcharge correctly with minimum charge', async () => {
    (resolveZone as jest.Mock).mockImplementation(async () => ({ zone: { id: 'z1', name: 'Z1' } }));
    
    (prisma.rateCard.findFirst as jest.Mock).mockResolvedValue({
      id: 'rc-1',
      basePrice: 500,
      baseWeightKg: 10,
      additionalPricePerKg: 10,
      minCharge: 500
    });

    (prisma.codConfig.findFirst as jest.Mock).mockResolvedValue({
      surchargeType: 'PERCENTAGE',
      value: 2, // 2%
      minCharge: 20 // minimum 20
    });

    const result = await calculateRate({
      pickupPincode: '111',
      dropPincode: '222',
      lengthCm: 10,
      breadthCm: 10,
      heightCm: 10,
      actualWeightKg: 1.0,
      orderType: 'B2B',
      paymentType: 'COD' // Requires COD surcharge
    });

    // Base charge is 500. 2% of 500 = 10. Minimum is 20, so COD surcharge is 20. Total = 520.
    expect(result.baseCharge).toBe(500);
    expect(result.codSurcharge).toBe(20);
    expect(result.totalCharge).toBe(520);
  });

  it('throws RATE_NOT_CONFIGURED if no rate card is found', async () => {
    (resolveZone as jest.Mock).mockImplementation(async () => ({ zone: { id: 'z1', name: 'Z1' } }));
    (prisma.rateCard.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(calculateRate({
      pickupPincode: '111',
      dropPincode: '222',
      lengthCm: 10,
      breadthCm: 10,
      heightCm: 10,
      actualWeightKg: 1.0,
      orderType: 'B2C',
      paymentType: 'PREPAID'
    })).rejects.toThrow('Rate not configured for this route');
  });
});
