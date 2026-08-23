# API Documentation

The Last-Mile Delivery Tracker exposes a RESTful API located at `/api/v1`.

## Authentication endpoints (`/api/v1/auth`)
- `POST /login`: Authenticate and receive JWT.
- `POST /register`: Register a new Customer.
- `POST /refresh`: Renew access token using httpOnly refresh token.
- `POST /logout`: Invalidate refresh token.
- `GET /me`: Get authenticated user profile.

## Orders (`/api/v1/orders`)
- `POST /quote`: Calculate rate for a potential order without creating it.
- `POST /`: Create a new order.
- `GET /`: List orders (scoped by role).
- `GET /:id`: Order details.
- `GET /:id/tracking`: Tracking timeline.
- `POST /:id/reschedule`: Request a delivery reschedule (Customer).
- `PATCH /:id/status`: Update order status (Agent).

## Agents (`/api/v1/agents`)
- `PATCH /me/availability`: Toggle agent online/offline.
- `PATCH /me/location`: Update GPS location for routing.
- `GET /me/orders`: List assigned orders.

## Admin Management (`/api/v1/admin`)
- `GET /dashboard`: KPI aggregates and metrics.
- `/zones`: CRUD for operational Zones.
- `/areas`: CRUD for pincode Areas.
- `/rate-cards`: Pricing logic configurations.
- `/cod-configs`: Cash on Delivery surcharges.
- `/orders/:id/status`: Admin override for order status.
- `/orders/:id/auto-assign`: Trigger assignment algorithm.
- `/agents`: Manage delivery fleet.
