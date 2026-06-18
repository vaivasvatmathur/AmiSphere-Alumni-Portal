import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import prisma from '../src/config/prismaClient.js';

dotenv.config();

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in env.');
  process.exit(1);
}

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log('Admin user already exists:', existing.email);
    return;
  }
  const hashed = await bcrypt.hash(adminPassword, 12);
  const user = await prisma.user.create({
    data: {
      name: 'Admin',
      email: adminEmail,
      password: hashed,
      role: 'ADMIN'
    }
  });
  console.log('Created admin user:', user.email);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
