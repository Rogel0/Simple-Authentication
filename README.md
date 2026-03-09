# Simple Auth Service with PostgreSQL

A minimalist authentication service demo with Express, TypeScript, and PostgreSQL.

## Features

- ✅ User registration
- ✅ User login
- ✅ JWT access tokens
- ✅ Password hashing with bcrypt
- ✅ Input validation with Zod
- ✅ Rate limiting & security headers

## Quick Start

```bash
# Install dependencies
npm install

# Setup database (run database.sql in pgAdmin or psql)

# Configure .env file with your DATABASE_URL and JWT_ACCESS_SECRET

# Start server
npm run dev
```

Server runs on http://localhost:3000

## API Endpoints

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Both endpoints return:

```json
{
  "status": "success",
  "data": {
    "user": { "id": "...", "email": "..." },
    "accessToken": "eyJhbG..."
  }
}
```

## Database Schema

**users** table:

- `id` (UUID) - Primary key
- `email` (VARCHAR) - Unique
- `password` (VARCHAR) - Bcrypt hashed
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Tech Stack

- Node.js + TypeScript
- Express.js
- PostgreSQL with node-postgres
- JWT for authentication
- bcrypt for password hashing
- Zod for validation
- Winston for logging

## License

ISC

## Features

- ✅ User registration and login
- ✅ JWT-based authentication (Access & Refresh tokens)
- ✅ Password hashing with bcrypt
- ✅ Account lockout after failed login attempts
- ✅ Refresh token rotation
- ✅ Cookie-based token storage
- ✅ Rate limiting
- ✅ Input validation with Zod
- ✅ Security headers with Helmet

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Run the SQL file to create tables:

```bash
# Using pgAdmin (recommended for Windows)
# Or using psql if installed:
psql -h your-host -U postgres -d railway -f database.sql
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update with your values:

```env
DATABASE_URL=your_railway_database_url
JWT_ACCESS_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
```

### 4. Run the Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Refresh Token

```http
POST /api/auth/refresh
Cookie: refreshToken=your_refresh_token
```

#### Logout

```http
POST /api/auth/logout
Cookie: refreshToken=your_refresh_token
```

#### Get Profile (Protected)

```http
GET /api/auth/profile
Authorization: Bearer your_access_token
# OR
Cookie: accessToken=your_access_token
```

## Database Schema

### users

- `id` - UUID primary key
- `email` - Unique email address
- `password` - Hashed password
- `login_attempts` - Failed login counter
- `lock_until` - Account lock timestamp
- `created_at` - Registration timestamp
- `updated_at` - Last update timestamp

### refresh_tokens

- `id` - UUID primary key
- `user_id` - Foreign key to users
- `token` - Refresh token string
- `created_at` - Token creation timestamp
- `expires_at` - Token expiration timestamp

## Security Features

### Password Security

- Passwords hashed with bcrypt (10 rounds)
- Minimum 6 characters required

### Account Protection

- Max 5 failed login attempts
- Account locked for 2 hours after reaching limit
- Login attempts reset on successful login

### Token Management

- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Tokens stored in httpOnly cookies
- Refresh token rotation on use

### API Protection

- Rate limiting (100 requests per 15 minutes)
- Helmet security headers
- CORS enabled
- Request validation with Zod

## Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Database Client:** node-postgres (pg)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Validation:** Zod
- **Logging:** Winston
- **Security:** Helmet, CORS, express-rate-limit

## Project Structure

```
src/
├── config/          # Configuration files
│   ├── database.ts  # PostgreSQL connection
│   ├── env.ts       # Environment variables
│   └── cookie.ts    # Cookie options
├── controllers/     # Route controllers
│   └── auth.controller.ts
├── middleware/      # Express middleware
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── models/          # Data models
│   └── user.model.ts
├── routes/          # API routes
│   └── auth.routes.ts
├── types/           # TypeScript types
│   └── env.d.ts
├── utils/           # Utility functions
│   ├── jwt.ts
│   └── logger.ts
└── server.ts        # Application entry point
```

## License

ISC
