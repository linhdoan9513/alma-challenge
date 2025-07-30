import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/config/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('Setting up database...');

  // Create admin user
  const adminEmail = 'admin@alma.com';
  const adminPassword = 'admin123';

  try {
    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await hashPassword(adminPassword);
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      },
    });

    console.log('Admin user created successfully:', adminUser.email);
    console.log('Login credentials:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
