# System Design & Architecture

This document outlines the six core architectural decisions for the Last-Mile Delivery Tracker.

## 1. Rate Calculation Engine
The rate engine employs a configurable `base_price` + `per_kg_beyond_base_weight` model, eschewing hardcoded weight slabs. Hardcoded slabs are brittle and require code changes for every pricing update. By defining a continuous linear curve beyond a free allowance (the base weight), the system supports infinite weights while remaining fully admin-configurable via four numeric fields per rate card: `base_price`, `base_weight_kg`, `additional_price_per_kg`, and `min_charge`. The pipeline computes volumetric weight, determines billable weight (the maximum of actual vs. volumetric), and applies the exact active rate card matching the order type (B2B/B2C) and zone relation (Intra/Inter).

## 2. Zone Detection Approach
Full geospatial polygon detection (geocoding) introduces external API dependencies, recurring costs, and point-in-polygon computational complexity. To maintain a deterministic, self-contained architecture, the system maps logical `Areas` (identified by a pincode) to `Zones`. Every address includes a pincode, which the system resolves against the database to determine its operational Zone. This approach guarantees 100% offline zone resolution, matches how actual Indian logistics rate cards are structured, and allows admins to control exact serviceability without relying on third-party map bounding boxes.

## 3. Auto-Assignment Logic
To optimize delivery dispatch, the auto-assignment algorithm executes inside a single database transaction using row-level constraints. It first filters for agents who are active, available, and below their `max_concurrent_orders` limit. If valid GPS coordinates exist for the pickup area and the agents, it computes the Haversine distance. However, because GPS updates are optional and often stale, the system heavily relies on a Zone-fallback path: it selects agents matching the order's pickup zone. Within the candidate pool, it load-balances by selecting the agent with the lowest active order count, using round-robin (oldest `last_assigned_at`) to break ties.

## 4. Failed Delivery Handling
Delivery failures are treated as a temporary suspension in the state machine, not an immediate terminal state. An agent marking an order as `FAILED` must supply a discrete failure reason enum (e.g., `CUSTOMER_UNAVAILABLE`). This pauses the fulfillment cycle, triggers an immediate customer notification with a call-to-action, and unlocks the Rescheduling flow. When a customer reschedules, the system inserts a tracking record, updates the `scheduled_delivery_date`, and re-injects the order into the auto-assignment algorithm as if it were a new order, ensuring it routes to the best available agent for the new date.

## 5. Database Architecture
The application uses PostgreSQL (via Prisma ORM) designed for high normalization. Entities are strictly separated: `users` handle authentication and core details, while `delivery_agents` is a 1:1 extension table storing logistics-specific fields like availability and active load. The `tracking_history` table is strictly append-only, capturing every state mutation as a discrete row. This structure prevents data anomalies, ensures referential integrity (e.g., blocking zone deletion if areas remain mapped), and allows efficient querying for complex admin dashboards without relying on unstructured JSON blobs.

## 6. Status Tracking & Immutability
Auditability is business-critical in logistics. To prevent unauthorized retroactive modifications to an order's lifecycle, immutability is enforced at three distinct layers:
1. **API Layer**: No PUT, PATCH, or DELETE endpoints are exposed for tracking history.
2. **ORM Layer**: The Prisma repository implementation exposes only a `create()` method for tracking entries.
3. **Database Layer**: In production environments, the application database role is granted `INSERT` and `SELECT` privileges only for the `tracking_history` table. Even if the application logic is compromised, the database engine will reject `UPDATE` or `DELETE` statements against the audit trail.
