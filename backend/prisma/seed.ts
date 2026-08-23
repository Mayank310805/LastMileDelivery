import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  const passwordHash = await bcrypt.hash('Admin@1234', 12);
  const customerPasswordHash = await bcrypt.hash('Customer@1234', 12);
  const agentPasswordHash = await bcrypt.hash('Agent@1234', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@lastmiletracker.dev' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@lastmiletracker.dev',
      phone: '9999999999',
      passwordHash: passwordHash,
      role: 'ADMIN',
    },
  });

  const b2cCustomer = await prisma.user.upsert({
    where: { email: 'priya.b2c@example.com' },
    update: {},
    create: {
      name: 'Priya',
      email: 'priya.b2c@example.com',
      phone: '8888888888',
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
    },
  });

  const b2bCustomer = await prisma.user.upsert({
    where: { email: 'acme.traders.b2b@example.com' },
    update: {},
    create: {
      name: 'Acme Traders',
      email: 'acme.traders.b2b@example.com',
      phone: '7777777777',
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
    },
  });

  const zoneNorth = await prisma.zone.upsert({
    where: { code: 'NORTH' },
    update: {},
    create: {
      name: 'North',
      code: 'NORTH',
    },
  });

  const zoneSouth = await prisma.zone.upsert({
    where: { code: 'SOUTH' },
    update: {},
    create: {
      name: 'South',
      code: 'SOUTH',
    },
  });

  const agentNorth1User = await prisma.user.upsert({
    where: { email: 'agent.north1@example.com' },
    update: {},
    create: {
      name: 'North Agent 1',
      email: 'agent.north1@example.com',
      phone: '6666666661',
      passwordHash: agentPasswordHash,
      role: 'AGENT',
      deliveryAgent: {
        create: {
          isAvailable: true,
          currentZoneId: zoneNorth.id
        }
      }
    },
  });

  const agentNorth2User = await prisma.user.upsert({
    where: { email: 'agent.north2@example.com' },
    update: {},
    create: {
      name: 'North Agent 2',
      email: 'agent.north2@example.com',
      phone: '6666666662',
      passwordHash: agentPasswordHash,
      role: 'AGENT',
      deliveryAgent: {
        create: {
          isAvailable: true,
          currentZoneId: zoneNorth.id
        }
      }
    },
  });

  const agentSouth1User = await prisma.user.upsert({
    where: { email: 'agent.south1@example.com' },
    update: {},
    create: {
      name: 'South Agent 1',
      email: 'agent.south1@example.com',
      phone: '5555555551',
      passwordHash: agentPasswordHash,
      role: 'AGENT',
      deliveryAgent: {
        create: {
          isAvailable: true,
          currentZoneId: zoneSouth.id
        }
      }
    },
  });

  const agentSouth2User = await prisma.user.upsert({
    where: { email: 'agent.south2@example.com' },
    update: {},
    create: {
      name: 'South Agent 2',
      email: 'agent.south2@example.com',
      phone: '5555555552',
      passwordHash: agentPasswordHash,
      role: 'AGENT',
      deliveryAgent: {
        create: {
          isAvailable: false,
          currentZoneId: zoneSouth.id
        }
      }
    },
  });

  const areaCN = await prisma.area.upsert({
    where: { pincode: '600001' },
    update: {},
    create: { name: 'Chennai North', pincode: '600001', city: 'Chennai', state: 'Tamil Nadu', zoneId: zoneNorth.id },
  });
  const areaCC = await prisma.area.upsert({
    where: { pincode: '600020' },
    update: {},
    create: { name: 'Chennai Central', pincode: '600020', city: 'Chennai', state: 'Tamil Nadu', zoneId: zoneNorth.id },
  });
  const areaMS = await prisma.area.upsert({
    where: { pincode: '400001' },
    update: {},
    create: { name: 'Mumbai South', pincode: '400001', city: 'Mumbai', state: 'Maharashtra', zoneId: zoneSouth.id },
  });
  const areaMC = await prisma.area.upsert({
    where: { pincode: '400020' },
    update: {},
    create: { name: 'Mumbai Central', pincode: '400020', city: 'Mumbai', state: 'Maharashtra', zoneId: zoneSouth.id },
  });
  const areaNew = await prisma.area.upsert({
    where: { pincode: '400123' },
    update: {},
    create: { name: 'Mumbai Suburbs', pincode: '400123', city: 'Mumbai', state: 'Maharashtra', zoneId: zoneSouth.id },
  });

  // Rate cards
  await prisma.rateCard.upsert({ where: { id: 'rc_b2c_intra' }, update: {}, create: { id: 'rc_b2c_intra', orderType: 'B2C', zoneRelation: 'INTRA', basePrice: 50, baseWeightKg: 1, additionalPricePerKg: 20, minCharge: 50 } });
  await prisma.rateCard.upsert({ where: { id: 'rc_b2c_inter' }, update: {}, create: { id: 'rc_b2c_inter', orderType: 'B2C', zoneRelation: 'INTER', basePrice: 80, baseWeightKg: 1, additionalPricePerKg: 30, minCharge: 80 } });
  await prisma.rateCard.upsert({ where: { id: 'rc_b2b_intra' }, update: {}, create: { id: 'rc_b2b_intra', orderType: 'B2B', zoneRelation: 'INTRA', basePrice: 40, baseWeightKg: 2, additionalPricePerKg: 15, minCharge: 40 } });
  await prisma.rateCard.upsert({ where: { id: 'rc_b2b_inter' }, update: {}, create: { id: 'rc_b2b_inter', orderType: 'B2B', zoneRelation: 'INTER', basePrice: 70, baseWeightKg: 2, additionalPricePerKg: 25, minCharge: 70 } });

  // Cod configs
  await prisma.codConfig.upsert({ where: { id: 'cod_b2c' }, update: {}, create: { id: 'cod_b2c', orderType: 'B2C', surchargeType: 'FLAT', value: 25, minCharge: 0 } });
  await prisma.codConfig.upsert({ where: { id: 'cod_b2b' }, update: {}, create: { id: 'cod_b2b', orderType: 'B2B', surchargeType: 'PERCENTAGE', value: 2, minCharge: 20 } });

  const agentNorth1 = await prisma.deliveryAgent.findUnique({ where: { userId: agentNorth1User.id } });
  const agentSouth1 = await prisma.deliveryAgent.findUnique({ where: { userId: agentSouth1User.id } });

  // 7 Orders
  const statuses = [
    { num: 'ORD001', status: 'DELIVERED', agent: agentNorth1, zone: zoneNorth, area: areaCN },
    { num: 'ORD002', status: 'IN_TRANSIT', agent: agentNorth1, zone: zoneNorth, area: areaCN },
    { num: 'ORD003', status: 'OUT_FOR_DELIVERY', agent: agentNorth1, zone: zoneNorth, area: areaCC },
    { num: 'ORD004', status: 'ASSIGNED', agent: agentSouth1, zone: zoneSouth, area: areaMS },
    { num: 'ORD005', status: 'FAILED', agent: agentSouth1, zone: zoneSouth, area: areaMS },
    { num: 'ORD006', status: 'ASSIGNED', agent: agentSouth1, zone: zoneSouth, area: areaMC }, // rescheduled->assigned
    { num: 'ORD007', status: 'CREATED', agent: null, zone: zoneNorth, area: areaCC }
  ];

  for (const o of statuses) {
    const pickupAddress = await prisma.address.create({
      data: {
        contactName: 'Pickup Person',
        contactPhone: '9999911111',
        line1: '123 Pickup St',
        city: o.area.city,
        state: o.area.state,
        pincode: o.area.pincode,
        areaId: o.area.id,
        createdByUserId: b2cCustomer.id
      }
    });

    const dropAddress = await prisma.address.create({
      data: {
        contactName: 'Drop Person',
        contactPhone: '9999922222',
        line1: '456 Drop St',
        city: o.area.city,
        state: o.area.state,
        pincode: o.area.pincode,
        areaId: o.area.id,
        createdByUserId: b2cCustomer.id
      }
    });

    const isFailed = o.status === 'FAILED';
    const isRescheduled = o.num === 'ORD006';

    await prisma.order.upsert({
      where: { orderNumber: o.num },
      update: {},
      create: {
        orderNumber: o.num,
        customerId: b2cCustomer.id,
        createdByUserId: b2cCustomer.id,
        pickupAddressId: pickupAddress.id,
        dropAddressId: dropAddress.id,
        orderType: 'B2C',
        paymentType: 'PREPAID',
        lengthCm: 10,
        breadthCm: 10,
        heightCm: 10,
        actualWeightKg: 1,
        volumetricWeightKg: 1,
        billableWeightKg: 1,
        pickupZoneId: o.zone.id,
        dropZoneId: o.zone.id,
        zoneRelation: 'INTRA',
        baseCharge: 50,
        codSurcharge: 0,
        totalCharge: 50,
        status: o.status,
        currentAgentId: o.agent ? o.agent.id : null,
        scheduledDeliveryDate: new Date(),
        rescheduleCount: isRescheduled ? 1 : 0,
        trackingHistory: {
          create: isFailed 
            ? [{ previousStatus: 'OUT_FOR_DELIVERY', newStatus: 'FAILED', changedByUserId: o.agent?.userId || admin.id, actorRole: 'AGENT', remarks: 'CUSTOMER_UNAVAILABLE' }] 
            : [{ newStatus: o.status, changedByUserId: admin.id, actorRole: 'ADMIN', remarks: 'Seed order' }]
        },
        assignments: o.agent ? {
          create: [{
            agentId: o.agent.id,
            assignedByUserId: admin.id,
            assignmentType: 'AUTO'
          }]
        } : undefined,
        reschedules: isRescheduled ? {
          create: [{
            requestedByUserId: b2cCustomer.id,
            previousScheduledDate: new Date(Date.now() - 86400000),
            newScheduledDate: new Date(),
            notes: 'Customer requested reschedule'
          }]
        } : undefined
      }
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
