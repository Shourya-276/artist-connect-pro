import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      artistProfile: true,
      clientProfile: true
    }
  });

  console.log('--- Users ---');
  users.forEach(user => {
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`Artist Name: ${user.artistProfile?.name || 'N/A'}`);
    console.log(`Client Name: ${user.clientProfile?.name || 'N/A'}`);
    console.log('---');
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
