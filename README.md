# Flex Living Assessment

A property management application with review integration from Hostaway and Google Places API.

## Prerequisites

- Node.js 18+ 
- pnpm package manager
- PostgreSQL database (local or cloud)
- Google Places API key
- Hostaway API credentials (optional)

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
gh repo clone GuidoTapia/flex-living-assessment
cd flex-living-assessment
pnpm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/flex_living"

# NextAuth.js
AUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google Places API
GOOGLE_PLACES_API_KEY="your-google-places-api-key"

# Hostaway API (optional)
HOSTAWAY_ACCOUNT_ID="your-hostaway-account-id"
HOSTAWAY_API_KEY="your-hostaway-api-key"

# Admin User (for seeding)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="secure-password"
ADMIN_NAME="Admin User"
```

### 3. Database Setup

#### Option A: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
```sql
CREATE DATABASE flex_living;
```

#### Option B: Cloud Database (Recommended)

Use one of these providers:
- **Neon** (Free tier available): https://neon.tech
- **Supabase** (Free tier available): https://supabase.com
- **PlanetScale** (Free tier available): https://planetscale.com

Get your connection string and update `DATABASE_URL` in `.env`.

### 4. Database Migration and Seeding

```bash
# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma db push

# Seed the database with sample data
pnpm prisma db seed
```

### 5. Start Development Server

```bash
pnpm dev
```

The application will be available at http://localhost:3000

## API Keys Setup

### Google Places API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable the Places API (New)
3. Create credentials (API Key)
4. Restrict the key to your domain for production
5. Add the key to your `.env` file

### Hostaway API (Optional)

1. Contact Hostaway for API access
2. Get your Account ID and API Key
3. Add credentials to your `.env` file

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── _components/        # Reusable components
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Admin dashboard
│   ├── properties/        # Property listings
│   └── property/          # Individual property pages
├── server/                # Server-side code
│   ├── api/               # tRPC routers
│   ├── auth/              # NextAuth configuration
│   └── services/          # External API services
├── styles/                # Global styles
└── trpc/                  # tRPC client setup
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm prisma studio` - Open Prisma Studio
- `pnpm prisma db push` - Push schema changes to database
- `pnpm prisma db seed` - Seed database with sample data

## Features

- Property listings with search and filtering
- Review management system
- Hostaway API integration for external reviews
- Google Places API integration for property details
- Admin dashboard for review approval
- Authentication with NextAuth.js
- Responsive design with Mantine UI

## Database Schema

The application uses the following main entities:
- **Users** - Authentication and user management
- **Properties** - Property listings
- **Listings** - External listing references
- **Reviews** - Guest reviews from various sources
- **Categories** - Property categories

