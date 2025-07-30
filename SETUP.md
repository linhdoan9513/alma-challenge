# Database Authentication Setup Guide

This guide will help you set up the database-based authentication system for the Alma lead management application.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- npm or yarn package manager

## Step 1: Database Setup

### Option A: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a new database:
   ```sql
   CREATE DATABASE alma_db;
   ```

### Option B: Cloud PostgreSQL (Recommended)

1. Use services like:
   - [Supabase](https://supabase.com) (Free tier available)
   - [Railway](https://railway.app) (Free tier available)
   - [Neon](https://neon.tech) (Free tier available)
   - [PlanetScale](https://planetscale.com) (Free tier available)

## Step 2: Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/alma_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
```

**Replace the DATABASE_URL with your actual database connection string.**

## Step 3: Database Migration

Run the following commands to set up your database:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Create admin user
npm run db:setup
```

## Step 4: Start the Application

```bash
npm run dev
```

## Step 5: Access the Application

1. **Public Lead Form**: `http://localhost:3000/lead-form`
2. **Admin Login**: `http://localhost:3000/admin/login`
3. **Admin Dashboard**: `http://localhost:3000/admin`

## Default Admin Credentials

After running `npm run db:setup`, you can login with:

- **Email**: `admin@alma.com`
- **Password**: `admin123`

**⚠️ Important**: Change these credentials in production!

## Production Deployment

### Environment Variables for Production

```env
# Database (use your production database URL)
DATABASE_URL="postgresql://username:password@your-db-host:5432/alma_db"

# NextAuth (generate a secure secret)
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret-key"
```

### Security Recommendations

1. **Change default admin credentials**
2. **Use strong NEXTAUTH_SECRET**
3. **Enable HTTPS in production**
4. **Set up proper database backups**
5. **Use environment-specific database URLs**

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify DATABASE_URL is correct
   - Check if database is running
   - Ensure network connectivity

2. **Prisma Client Error**
   - Run `npm run db:generate`
   - Restart development server

3. **Authentication Not Working**
   - Check NEXTAUTH_SECRET is set
   - Verify NEXTAUTH_URL matches your domain
   - Ensure admin user was created with `npm run db:setup`

### Database Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database (⚠️ WARNING: Deletes all data)
npx prisma migrate reset

# Generate new migration
npx prisma migrate dev --name your_migration_name
```

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx          # Login page
│   │   └── page.tsx                # Protected admin dashboard
│   └── api/
│       ├── auth/[...nextauth]/     # NextAuth configuration
│       ├── leads/route.ts          # Protected leads API
│       └── submit-lead/route.ts    # Public lead submission API
├── components/
│   └── SessionProvider.tsx         # NextAuth provider
├── lib/
│   ├── auth.ts                     # Authentication utilities
│   ├── prisma.ts                   # Database client
│   └── config.ts                   # Configuration
└── prisma/
    └── schema.prisma               # Database schema
```

## Support

If you encounter any issues:

1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure database is accessible
4. Check Prisma schema is up to date
