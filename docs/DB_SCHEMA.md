# Database Schema

The system uses SQLite via Prisma ORM.

## Core Tables

### User
Stores global authentication and profile data.
- Fields: `id`, `name`, `email`, `phone`, `passwordHash`, `role` (CUSTOMER|AGENT|ADMIN)

### DeliveryAgent
Extends `User` for agent-specific state.
- Fields: `userId`, `isAvailable`, `currentZoneId`, `currentLat/Lng`, `maxConcurrentOrders`

### Zone & Area
Geographical hierarchy.
- **Zone**: Operational hubs (e.g. "North", "South").
- **Area**: specific pincodes mapping to a Zone.

### Order
The primary operational unit.
- Fields: `pickupAddressId`, `dropAddressId`, `orderType` (B2B|B2C), `paymentType`, Dimensions, Weights, Pricing, `status`.

### OrderAssignment
History of which agent handled the order.

### TrackingHistory
Immutable log of order status transitions for tracking timelines.

### RateCard & CodConfig
Pricing rules applied dynamically during the Quote and Order Creation steps.
