# LastMile Delivery — System Design & Architecture

This document provides a high-level overview of the core algorithmic components powering the LastMile logistics platform. It covers the billing logic, spatial routing, driver assignment, and exception handling systems.

---

## 1. Rate Calculation Engine

The billing engine is responsible for generating accurate quotes dynamically based on dimensions, order type, and geographical topology.

### Billable Weight Calculation
The system calculates the **Volumetric Weight** using the standard logistics formula:
```
Volumetric Weight (kg) = (Length × Breadth × Height in cm) / 5000
```
The **Billable Weight** is strictly defined as `max(Actual Weight, Volumetric Weight)`.

### Tiered Base Pricing
Using the resolved zones (see below) and the order classification (B2B vs B2C), the engine looks up the active `RateCard`.
The base charge is calculated as:
1. Start with the `basePrice` (which covers up to `baseWeightKg`).
2. If `Billable Weight > baseWeightKg`, apply the overage fee: 
   `(Billable Weight - baseWeightKg) × additionalPricePerKg`
3. Enforce the `minCharge` threshold.

### COD Surcharges
If the user selects Cash on Delivery (COD), the system queries the active `CodConfig`. The surcharge can be a `FLAT` rate or a `PERCENTAGE` of the base charge (while respecting a configured minimum COD threshold). The final price is the sum of the base charge and the COD surcharge.

---

## 2. Zone Detection & Spatial Relation

Effective last-mile logistics relies on accurate grouping of delivery addresses into operational "Zones". 

### Pincode Mapping
When an order is created, the system extracts the `pincode` from both the Pickup and Drop addresses. It queries the `Area` table, which holds a strict many-to-one mapping of pincodes to dynamic `Zones` (e.g., "North Zone", "Metro Core").

### Zone Relation (INTRA vs INTER)
Once both the pickup and drop pincodes are resolved to their respective Zones, the routing relationship is determined:
- **INTRA-Zone**: Pickup and drop belong to the exact same Zone ID. This is typically cheaper and requires fewer hubs.
- **INTER-Zone**: Pickup and drop are in different Zones. This usually involves hub-to-hub transfer logistics and invokes higher pricing tiers on the Rate Card.

---

## 3. Auto-Assignment Logic

The dispatch engine is designed to intelligently route orders to the best available delivery agent without human intervention.

### Capacity & Availability Filtering
1. The engine fetches all agents where `isAvailable == true`.
2. It calculates the active order count for each agent (orders in `ASSIGNED`, `PICKED_UP`, `IN_TRANSIT`, or `OUT_FOR_DELIVERY` states).
3. Agents who have reached their `maxConcurrentOrders` threshold are aggressively filtered out.

### Geospatial & Workload Prioritization
The remaining candidates are placed into a selection pool with the following priorities:
1. **Zone Matching (Primary Filter)**: The engine prioritizes agents whose `currentZoneId` strictly matches the order's `pickupZoneId`. If no agents are available in the local zone, it expands to the broader pool as a fallback.
2. **Workload Balancing (Primary Sort)**: The candidates are sorted ascending by their current active order count. The agent carrying the lightest load is preferred.
3. **Round-Robin Fallback (Secondary Sort)**: If multiple agents have the exact same workload, the engine sorts by `lastAssignedAt` (ascending), ensuring fair distribution of trips.

Upon selection, the system updates the Order, writes an `OrderAssignment` trace, drops an immutable `TrackingHistory` log, and updates the agent's `lastAssignedAt` timestamp within a single atomic database transaction.

---

## 4. Failed Delivery & Exception Handling

Delivery failures (e.g., customer unavailable, incorrect address) require strict operational guardrails and a seamless recovery experience.

### State Transition to FAILED
When an agent marks an order as failed on their mobile dashboard, they must supply a programmatic failure reason. The order status is transitioned to `FAILED`. 
At this point, the UI immediately alerts the customer via a prominent, red warning banner on their dashboard, explaining the exact failure reason (e.g., "Customer Unavailable").

### Rescheduling Constraints
Customers are empowered to reschedule failed deliveries directly from the app. However, the system enforces the following constraints:
1. **Max Attempts**: An order is strictly capped at a maximum of 3 rescheduling attempts. If `rescheduleCount >= 3`, the API blocks the request with a `MAX_RESCHEDULES_EXCEEDED` exception.
2. **Re-routing**: When a customer confirms a new date, the system clears the `currentAgentId` and transitions the order to `RESCHEDULED`.
3. **Dispatch Trigger**: The system immediately fires the `autoAssignAgent` routine to re-queue the package into the operational flow. 

### Immutable Audit Logs
Every step of the failure and recovery flow—the agent's failure declaration, the customer's reschedule request, and the system's reassignment—is permanently written to the `TrackingHistory` ledger. This ensures that operations managers have complete visibility into the lifecycle of every exception.
