# Alma - Full-Stack Lead Management System

A modern full-stack application for managing visa application leads with separate backend and frontend architecture.

## 🏗️ Architecture

```
alma/
├── backend/          # Express.js + Prisma + PostgreSQL API
├── frontend/         # Next.js + React + TypeScript UI
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Database Setup

1. **Set up PostgreSQL database**

   - Create a new database: `CREATE DATABASE alma_db;`

2. **Configure environment variables**

   ```bash
   # Backend (.env file in backend/ directory)
   DATABASE_URL="postgresql://username:password@localhost:5432/alma_db"
   JWT_SECRET="your-super-secret-key-change-this-in-production"
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL="http://localhost:3000"
   ```

3. **Initialize database**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # Create admin user
   npm run db:setup
   ```

### 3. Start Development Servers

```bash
# Start both backend and frontend
npm run dev

# Or start them separately:
npm run dev:backend  # Backend on http://localhost:5000
npm run dev:frontend # Frontend on http://localhost:3000
```

## 📁 Project Structure

### Backend (`/backend`)

```
backend/
├── src/
│   ├── config/          # Database and auth configuration
│   ├── controllers/     # API route handlers
│   ├── middleware/      # Authentication and validation
│   ├── routes/          # API route definitions
│   └── index.ts         # Express server entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── scripts/
│   └── setup-db.ts      # Database setup script
└── package.json
```

**Key Features:**

- Express.js REST API
- Prisma ORM with PostgreSQL
- JWT authentication
- Input validation and sanitization
- Rate limiting
- CORS configuration

### Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── app/             # Next.js app router pages
│   │   ├── admin/       # Admin dashboard with lead management
│   │   │   └── login/   # Admin login page
│   │   ├── lead-form/   # Public lead submission form
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Home page
│   ├── components/      # Reusable React components
│   │   ├── LeadForm.tsx # Main lead form component
│   │   ├── VisaCheckboxes.tsx # Visa type selection
│   │   ├── CustomResumeUpload.tsx # Resume upload
│   ├── lib/             # Utilities and API client
│   │   ├── api.ts       # API client functions
│   │   └── countries.ts # Countries data
│   ├── store/           # Redux store
│   │   ├── leadSlice.ts # Lead state management
│   │   └── store.ts     # Store configuration
│   └── styles/          # Styled components types
│       └── styled.d.ts  # Styled components types
└── package.json
```

**Key Features:**

- Next.js 15 with App Router
- React 19 with TypeScript
- Styled Components for styling
- Redux Toolkit for state management
- Material-UI components
- JWT-based authentication

## 🔐 Authentication

### Default Admin Credentials

- **Email**: `admin@alma.com`
- **Password**: `admin123`

**⚠️ Important**: Change these credentials in production!

### Authentication Flow

1. Admin logs in via `/admin/login`
2. JWT token is stored in localStorage
3. Token is sent with API requests
4. Backend validates token and authorizes requests

## 📊 API Endpoints

### Public Endpoints

- `POST /api/leads/submit` - Submit new lead

### Protected Endpoints (Admin Only)

- `POST /api/auth/login` - Admin login
- `GET /api/auth/profile` - Get user profile
- `GET /api/leads` - Get all leads (with pagination)
- `PATCH /api/leads/:id/status` - Update lead status

## 🎯 Features

### Lead Management

- ✅ Public lead submission form
- ✅ Admin dashboard with lead list
- ✅ Lead status management (PENDING → REACHED_OUT)
- ✅ Search and filtering
- ✅ Pagination
- ✅ Sorting by multiple fields

### Security

- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Protected routes

### Database

- ✅ PostgreSQL with Prisma ORM
- ✅ User and Lead models
- ✅ Proper relationships and constraints
- ✅ Database migrations

## 🛠️ Development

### Backend Development

```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run db:studio    # Open Prisma Studio
```

### Frontend Development

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Database Management

```bash
# From root directory
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:setup     # Create admin user
```

### Build and Deploy

```bash
# Build both applications
npm run build

# Start production servers
npm start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Verify DATABASE_URL is correct
   - Check if PostgreSQL is running
   - Ensure database exists

2. **Authentication Issues**

   - Check JWT_SECRET is set
   - Verify admin user was created
   - Clear localStorage and re-login

3. **CORS Errors**

   - Check FRONTEND_URL in backend .env
   - Verify frontend is running on correct port

4. **Prisma Errors**

   - Run `npm run db:generate`
   - Check database schema
   - Restart development server

5. **Resume Upload Issues**
   - Create uploads folder: `mkdir -p backend/uploads`
   - Ensure folder has write permissions: `chmod 755 backend/uploads`
   - Resume files will be stored as: `backend/uploads/resume.pdf`

### Database Commands

```bash
# Reset database (⚠️ WARNING: Deletes all data)
cd backend && npx prisma migrate reset

# View database in browser
cd backend && npx prisma studio

# Generate new migration
cd backend && npx prisma migrate dev --name your_migration_name
```
