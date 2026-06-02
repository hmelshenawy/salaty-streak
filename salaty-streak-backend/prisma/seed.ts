import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MILESTONES = [
  { title: 'First Step', targetDays: 3, description: 'Keep going for 3 consecutive days', icon: '🌱' },
  { title: 'One Week', targetDays: 7, description: 'A full week of consistency', icon: '🌙' },
  { title: 'Consistency Builder', targetDays: 15, description: 'Half a month strong', icon: '💪' },
  { title: 'Strong Habit', targetDays: 30, description: 'A full month of dedication', icon: '⭐' },
  { title: 'Discipline Master', targetDays: 60, description: 'Two months of unwavering commitment', icon: '🏆' },
  { title: 'Elite Consistency', targetDays: 90, description: 'Three months of excellence', icon: '👑' },
  { title: 'Half Year Champion', targetDays: 180, description: 'Six months of steadfast prayer', icon: '🏅' },
  { title: 'Full Year Achievement', targetDays: 365, description: 'A full year — truly remarkable', icon: '🌟' },
];

async function main() {
  console.log('Seeding milestones...');
  for (const milestone of MILESTONES) {
    await prisma.milestone.upsert({
      where: { targetDays: milestone.targetDays },
      update: { title: milestone.title, description: milestone.description, icon: milestone.icon },
      create: milestone,
    });
  }
  console.log(`Seeded ${MILESTONES.length} milestones.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });