# Rate Calculation Engine

The system uses a multi-step pipeline for dynamic rate calculation.

## 1. Weight Determination
1. **Volumetric Weight**: Computed using dimensions `(L × B × H) / 5000`.
2. **Billable Weight**: The greater of the Actual Weight and Volumetric Weight.

## 2. Zone Relation
Based on pickup and drop pincodes:
- **INTRA**: Both pincodes map to the same Zone.
- **INTER**: Pincodes map to different Zones.

## 3. Base Charge
Derived from the active `RateCard` matching the OrderType (B2B/B2C) and ZoneRelation.
- **Formula**: `BasePrice + MAX(0, BillableWeight - BaseWeight) * AdditionalPricePerKg`
- Must be >= `MinCharge`.

## 4. COD Surcharge (if applicable)
Derived from active `CodConfig` for the OrderType.
- **FLAT**: Adds fixed `value`.
- **PERCENTAGE**: Adds `BaseCharge * (value / 100)`, with a `minCharge` floor.
