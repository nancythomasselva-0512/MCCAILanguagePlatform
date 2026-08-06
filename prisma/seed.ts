import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SQLite database...');

  // Seed Subscription Plans
  const plans = [
    { name: 'Free', price: 0, transcription_limit: 30, translation_limit: 50000, tts_limit: 10000, storage_limit: 100 },
    { name: 'Starter', price: 29, transcription_limit: 120, translation_limit: 200000, tts_limit: 50000, storage_limit: 500 },
    { name: 'Professional', price: 99, transcription_limit: 600, translation_limit: 1000000, tts_limit: 250000, storage_limit: 2000 },
    { name: 'Enterprise', price: 299, transcription_limit: 3000, translation_limit: 5000000, tts_limit: 1000000, storage_limit: 10000 },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
  }

  // Create default tenant workspace
  const defaultPlan = await prisma.subscriptionPlan.findUnique({ where: { name: 'Starter' } });
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'fluentia-workspace' },
    update: {},
    create: {
      tenant_name: 'Fluentia AI Enterprise Workspace',
      slug: 'fluentia-workspace',
      status: 'active',
      plan_id: defaultPlan?.id,
    },
  });

  // Create Super Admin User
  const adminPasswordHash = await bcrypt.hash('aiadmin123', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'aiadmin@gmail.com' },
    update: {
      role: 'super_admin',
      password_hash: adminPasswordHash,
    },
    create: {
      name: 'Platform Super Administrator',
      email: 'aiadmin@gmail.com',
      password_hash: adminPasswordHash,
      role: 'super_admin',
      status: 'active',
      tenant_id: tenant.id,
    },
  });

  console.log('Database seeding completed cleanly!');
  console.log(`Created Super Admin: ${superAdmin.email}`);
  console.log(`Created Workspace: ${tenant.slug}`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
