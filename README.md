# Last-Mile Delivery Tracker

A full-stack, enterprise-grade last-mile delivery tracking system designed for efficient order routing, agent assignment, and real-time tracking.

## Tech Stack
- **Frontend**: React 18, Vite, TypeScript, Custom Light/Dark SaaS Design System, Lucide React, TanStack Query
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, SQLite
- **Authentication**: JWT (Access + Refresh tokens) with BCrypt hashing
- **Architecture**: Role-Based Access Control (Admin, Agent, Customer)

## Features
- **Zone & Area Management**: Geospatial-aware area mappings and dynamic zones.
- **Advanced Rate Engine**: B2B/B2C, Intra/Inter zone logic, Volumetric vs Actual weight comparisons.
- **Algorithmic Assignment**: Auto-assignment based on GPS proximity, workload capacity, and zone-matching fallbacks.
- **Modern UI/UX & Dark Mode**: A stunning, professional SaaS design system with native light/dark theme toggles, scroll animations, and rich generated imagery across all roles (Admin, Agent, Customer).
- **Tracking & Notifications**: Granular order state machine, mock email/SMS push notifications.

---

## File Structure

```text
LastMileDelivery/
├── backend/
│   ├── prisma/             # Database schema (schema.prisma) and seed data
│   ├── src/
│   │   ├── config/         # Configuration files (Database, etc.)
│   │   ├── middleware/     # Express middlewares (Auth, Error handling)
│   │   ├── modules/        # Domain-driven modules (auth, orders, tracking, admin, agents)
│   │   ├── utils/          # Utility functions and custom Error handlers
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── .env.example        # Backend environment variables template
│   └── package.json
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── hooks/          # Custom React hooks (if any)
│   │   ├── pages/          # Application pages/routes
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # React entry point
│   ├── .env.example        # Frontend environment variables template
│   └── package.json
├── docs/                   # Detailed documentation files
└── README.md
```

---

## Setup Guide

### Prerequisites
- Node.js v22.14+
- npm v10+

### 1. Environment Variables (`.env`)

#### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env` and update the values if necessary.
```env
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL=file:./dev.db
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
EMAIL_PROVIDER=mock
SMS_PROVIDER=mock
```

#### Frontend (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`.
```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

### 2. Backend Setup
Navigate to the backend directory and run the initialization commands:
```sh
cd backend
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

### 3. Frontend Setup
In a new terminal window, navigate to the frontend directory:
```sh
cd frontend
npm install
npm run dev
```

### Default Credentials (from Seed)
- **Admin**: `admin@lastmiletracker.dev` / `Admin@1234`
- **Customer (B2C)**: `priya.b2c@example.com` / `Customer@1234`
- **Delivery Agent**: `agent.north1@example.com` / `Agent@1234`

---

## DB Schema Summary

The database uses Prisma ORM with SQLite. The primary entities include:

- **User**: Handles authentication and roles (`CUSTOMER`, `AGENT`, `ADMIN`).
- **DeliveryAgent**: Extends User for delivery staff, tracks current location (`currentLat`, `currentLng`), availability, and max concurrent orders.
- **Zone & Area**: Defines geographical zones and areas (via pincode). Zones contain multiple areas and are used for calculating rates and assigning agents.
- **Address**: Stores delivery addresses linked to an Area.
- **Order**: Central entity for deliveries. Tracks dimensions, weight, pickup/drop addresses, zone relations (INTRA vs INTER), pricing, statuses, and assigned agent.
- **OrderAssignment**: History of which agent was assigned to an order.
- **TrackingHistory**: Immutable log of status changes and location notes for orders.
- **RateCard & CodConfig**: Pricing rules based on order type (B2B/B2C) and relation (INTRA/INTER).
- **Notification**: Stores communication logs (EMAIL/SMS).
- **Reschedule**: Tracks order rescheduling requests.

*For full details, view `backend/prisma/schema.prisma`.*

---

## Rate Calculation Logic

The order pricing is determined by the `calculateRate` engine (`backend/src/modules/orders/rate-calc-engine.ts`) through the following logic:

1. **Zone Resolution**: 
   Pickup and drop pincodes are mapped to their respective Zones. If both belong to the same zone, the relation is `INTRA`, otherwise `INTER`.

2. **Weight Calculation**: 
   - `Volumetric Weight (kg) = (Length × Breadth × Height) / 5000`
   - `Billable Weight (kg) = max(Actual Weight, Volumetric Weight)`

3. **Base Charge**:
   - The engine looks up the active `RateCard` for the given Order Type (B2B/B2C) and Zone Relation.
   - It starts with the `basePrice`.
   - If `Billable Weight > baseWeightKg`, an additional charge is added: `(Billable Weight - baseWeightKg) × additionalPricePerKg`.
   - The total base charge is enforced to be at least `minCharge`.

4. **COD Surcharge**:
   - If payment type is `COD`, the `CodConfig` is evaluated.
   - Surcharge is either a `FLAT` rate or a `PERCENTAGE` of the Base Charge (with a minimum threshold).

5. **Total Charge**:
   `Total Charge = Base Charge + COD Surcharge`

---

## API Docs Summary

The backend exposes a REST API mounted at `/api/v1`. The main routes include:

- **Auth** (`/api/v1/auth`): Login, register, token refresh.
- **Orders** (`/api/v1/orders`): 
  - `POST /` - Create a new order (calculates rate automatically).
  - `GET /` - List orders (with role-based filtering).
  - `GET /:id` - Get specific order details.
- **Tracking** (`/api/v1/tracking`): Update order status (e.g., `PICKED_UP`, `IN_TRANSIT`, `DELIVERED`), add tracking history.
- **Assignment** (`/api/v1/assignments`): Auto or manual assignment of orders to delivery agents.
- **Admin** (`/api/v1/admin`): Master data management (Zones, Areas, RateCards, Users).
- **Agents** (`/api/v1/agents`): Agent location updates and availability toggling.

*Each module is neatly separated in `backend/src/modules/` with its own `.routes.ts` file.*
