# Alma Project Structure

## 📁 Root Directory Structure

```
alma/
├── backend/              # Express.js + Prisma + PostgreSQL API
├── frontend/             # Next.js + React + TypeScript UI
├── .git/                 # Git repository
├── .vscode/              # VS Code settings
├── .gitignore           # Git ignore rules
├── package.json         # Root package.json with scripts
├── README.md            # Main project documentation
├── SETUP.md             # Database setup guide
└── PROJECT_STRUCTURE.md # This file
```

## 🏗️ Backend Structure (`/backend`)

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts   # Prisma client configuration
│   │   └── auth.ts       # Authentication utilities
│   ├── controllers/
│   │   ├── authController.ts  # Authentication handlers
│   │   └── leadController.ts  # Lead management handlers
│   ├── middleware/
│   │   ├── auth.ts       # JWT authentication middleware
│   │   └── validation.ts # Input validation middleware
│   ├── routes/
│   │   ├── auth.ts       # Authentication routes
│   │   └── leads.ts      # Lead management routes
│   └── index.ts          # Express server entry point
├── prisma/
│   └── schema.prisma     # Database schema
├── scripts/
│   └── setup-db.ts       # Database setup script
├── package.json          # Backend dependencies
├── package-lock.json     # Lock file
├── tsconfig.json         # TypeScript configuration
├── nodemon.json          # Development server configuration
├── env.example           # Environment variables template
└── node_modules/         # Dependencies
```

## 🎨 Frontend Structure (`/frontend`)

```
frontend/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── page.tsx    # Admin login page
│   │   │   └── page.tsx        # Admin dashboard with lead management
│   │   ├── lead-form/
│   │   │   └── page.tsx        # Public lead form
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   ├── LeadForm.tsx        # Main lead form component
│   │   ├── LeadFormConfig.ts   # JsonForms configuration
│   │   ├── CountrySelect.tsx   # Country selection component
│   │   ├── CountrySelectRenderer.tsx # JsonForms renderer for countries
│   │   ├── VisaCheckboxes.tsx  # Visa type selection
│   │   ├── CustomResumeUpload.tsx # Resume upload component
│   │   ├── FileUploadRenderer.tsx # JsonForms file upload renderer
│   │   ├── SessionProvider.tsx # Session management
│   │   ├── ClientWrapper.tsx   # Client-side wrapper
│   │   └── ThemeProvider.tsx   # Theme provider
│   ├── lib/
│   │   ├── api.ts              # API client functions
│   │   └── countries.ts        # Countries data and utilities
│   ├── store/
│   │   ├── leadSlice.ts        # Redux slice for leads
│   │   └── store.ts            # Redux store configuration
│   ├── styles/
│   │   ├── GlobalStyles.ts     # Global styled components
│   │   └── styled.d.ts         # Styled components types
│   └── types/
│       └── jest.d.ts           # Jest type definitions
├── public/               # Static assets
├── package.json          # Frontend dependencies
├── package-lock.json     # Lock file
├── tsconfig.json         # TypeScript configuration
├── next.config.ts        # Next.js configuration
├── eslint.config.mjs     # ESLint configuration
├── postcss.config.mjs    # PostCSS configuration
├── next-env.d.ts         # Next.js types
├── .gitignore            # Frontend git ignore
├── README.md             # Frontend documentation
└── node_modules/         # Dependencies
```

## 🔧 Key Features by Directory

### Backend (`/backend`)

- **Express.js REST API** with TypeScript
- **Prisma ORM** with PostgreSQL database
- **JWT authentication** with bcrypt password hashing
- **Input validation** and sanitization
- **Rate limiting** on lead submissions
- **CORS configuration** for frontend communication
- **Modular architecture** with controllers, routes, and middleware

### Frontend (`/frontend`)

- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Styled Components** for styling
- **Redux Toolkit** for state management
- **Material-UI** components
- **JWT-based authentication** with localStorage
- **Responsive design** with modern UI/UX

## 🚀 Development Workflow

### Root Level Scripts

```bash
npm run dev              # Start both backend and frontend
npm run dev:backend      # Start only backend (port 5000)
npm run dev:frontend     # Start only frontend (port 3000)
npm run build            # Build both applications
npm run start            # Start production servers
npm run db:setup         # Setup database and admin user
npm run install:all      # Install all dependencies
```

### Backend Development

```bash
cd backend
npm run dev              # Start development server
npm run build            # Build for production
npm run db:studio        # Open Prisma Studio
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
```

### Frontend Development

```bash
cd frontend
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Run ESLint
```

## 🔐 Authentication Flow

1. **Admin Login**: `/admin/login` → JWT token stored in localStorage
2. **Protected Routes**: Token sent with API requests
3. **Backend Validation**: JWT verified on each protected endpoint
4. **Auto Logout**: Token expiration or 401 responses trigger logout

## 📊 API Endpoints

### Public

- `POST /api/leads/submit` - Submit new lead

### Protected (Admin Only)

- `POST /api/auth/login` - Admin login
- `GET /api/auth/profile` - Get user profile
- `GET /api/leads` - Get all leads (with pagination)
- `PATCH /api/leads/:id/status` - Update lead status

## 🎯 Benefits of This Structure

1. **Clear Separation**: Backend and frontend are completely independent
2. **Scalability**: Each can be deployed and scaled separately
3. **Team Development**: Different teams can work on each part
4. **Technology Flexibility**: Can use different tech stacks
5. **Deployment Options**: Can deploy to different platforms
6. **Maintainability**: Clear organization and modular architecture
7. **Testing**: Can test backend and frontend independently

## 🔄 Migration from Monolithic

This structure was created by migrating from a monolithic Next.js application to a proper full-stack architecture:

- **Moved API routes** from Next.js to Express.js
- **Separated database logic** into dedicated backend
- **Created proper authentication** with JWT
- **Maintained all functionality** while improving architecture
- **Added proper error handling** and validation
- **Improved security** with proper middleware
