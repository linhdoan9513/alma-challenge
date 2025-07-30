import { compare, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './database';

export const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await compare(password, hashedPassword);
}

export async function createUser(
  email: string,
  password: string,
  role: string = 'admin'
) {
  const hashedPassword = await hashPassword(password);

  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
    },
  });
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);
  return isValid ? user : null;
}

export function generateToken(
  userId: string,
  email: string,
  role: string
): string {
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };
  } catch {
    return null;
  }
}
