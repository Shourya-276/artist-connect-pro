import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Categories
  const categories = [
    { name: 'Singers', icon: '🎤' },
    { name: 'DJs', icon: '🎧' },
    { name: 'Bands', icon: '🎸' },
    { name: 'Dancers', icon: '💃' },
    { name: 'Comedians', icon: '😂' },
    { name: 'Anchors', icon: '🎙️' },
    { name: 'Instrumentalists', icon: '🎹' },
    { name: 'Others', icon: '🎭' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  // 2. Genres
  const genres = ['Bollywood', 'EDM', 'HipHop', 'Punjabi', 'Rock', 'Indie', 'Classical', 'Sufi', 'Retro', 'Techno', 'Others'];
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { name: genre },
      update: {},
      create: { name: genre },
    });
  }

  // 3. Cities
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Goa', 'Chandigarh'];
  for (const city of cities) {
    await prisma.city.upsert({
      where: { name: city },
      update: {},
      create: { name: city },
    });
  }

  // 4. Testimonials
  const testimonials = [
    { name: 'Anita Sharma', role: 'Event Manager, TCS', text: 'Found The Perfect Band For Our Annual Event. Seamless Experience!', rating: 5 },
    { name: 'Rohit Mehra', role: 'Wedding Planner', text: 'Best Platform For Finding Quality Artists. Highly Recommended!', rating: 5 },
    { name: 'Sneha Patel', role: 'College Fest Coordinator', text: 'Booked 5 Artists For Our Fest. Amazing Variety And Quality.', rating: 4 },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({
      data: t,
    });
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
