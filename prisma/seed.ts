import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user with properly hashed password
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hcm.com' },
    update: {},
    create: {
      email: 'admin@hcm.com',
      passwordHash: hashedPassword,
      name: 'Admin HCM202',
      role: 'ADMIN',
    },
  });

  // Create anonymous user for community posts
  const anonymousPassword = await bcrypt.hash('anonymous', 12);
  const anonymousUser = await prisma.user.upsert({
    where: { email: 'anonymous@community.local' },
    update: {},
    create: {
      email: 'anonymous@community.local',
      passwordHash: anonymousPassword,
      name: 'Người dùng ẩn danh',
      role: 'USER',
    },
  });

  console.log('Seeded users:', { adminUser, anonymousUser });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
