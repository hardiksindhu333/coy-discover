import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const photoIds = [
  "1494790108377-be9c29b29330",
  "1500648767791-00dcc994a43e",
  "1534528741775-53994a69daeb",
  "1506794778202-cad84cf45f1d",
  "1517841905240-472988babdf9",
  "1531123897727-8f129e1688ce",
  "1507003211169-0a1dd7228f2d",
  "1524504388940-b1c1722653e1",
  "1544005313-94ddf0286df2",
  "1507591064344-4c6ce005b128",
  "1547425260-76bcadfb4f2c",
  "1529626455594-4ff0802cfb7e",
];

const names = [
  "Aarav", "Maya", "Noah", "Zara", "Leo", "Isha", "Theo", "Amara",
  "Ethan", "Sofia", "Kabir", "Nina", "Owen", "Priya", "Lucas", "Mila",
  "Arjun", "Elena", "Sam", "Anika", "Ryan", "Leah", "Dev", "Tara",
  "Miles", "Aisha", "Alex", "Rhea", "Daniel", "Nora", "Jay", "Meera",
  "Finn", "Kira", "Vikram", "Grace",
];

const cities = [
  "New York, NY", "Austin, TX", "San Francisco, CA", "Chicago, IL",
  "Seattle, WA", "Boston, MA", "Los Angeles, CA", "Denver, CO",
];

const colleges = [
  "NYU", "UT Austin", "Stanford", "UChicago", "University of Washington",
  "Boston University", "UCLA", "University of Denver",
];

const interests = [
  ["Coffee", "Live music", "Hiking"],
  ["Running", "Books", "Museums"],
  ["Photography", "Travel", "Cooking"],
  ["Yoga", "Indie films", "Brunch"],
  ["Startups", "Basketball", "Podcasts"],
];

async function main() {
  await prisma.user.upsert({
    where: { id: "current-user" },
    update: {},
    create: {
      id: "current-user",
      name: "Alex",
      age: 24,
      photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      bio: "Curious, optimistic, and always looking for the next good conversation.",
      city: "New York, NY",
      college: "Columbia University",
      interests: JSON.stringify(["Technology", "Coffee", "Live music"]),
      isCurrent: true,
    },
  });

  for (let index = 0; index < names.length; index += 1) {
    const profileId = `profile-${index + 1}`;
    const cityIndex = index % cities.length;
    await prisma.user.upsert({
      where: { id: profileId },
      update: {},
      create: {
        id: profileId,
        name: names[index],
        age: 21 + ((index * 3) % 8),
        photoUrl: `https://images.unsplash.com/photo-${photoIds[index % photoIds.length]}?auto=format&fit=crop&w=1200&q=88`,
        bio: [
          "Weekend explorer who believes the best stories start with a spontaneous plan.",
          "Big on honest conversations, small rituals, and trying one new recipe a week.",
          "Usually at a cafe, gallery, or park, looking for something interesting.",
        ][index % 3],
        city: cities[cityIndex],
        college: colleges[cityIndex],
        interests: JSON.stringify(interests[index % interests.length]),
      },
    });
  }

  for (let index = 1; index <= 12; index += 1) {
    await prisma.swipe.upsert({
      where: {
        actorId_targetId: {
          actorId: `profile-${index}`,
          targetId: "current-user",
        },
      },
      update: {},
      create: {
        actorId: `profile-${index}`,
        targetId: "current-user",
        direction: "LIKE",
      },
    });
  }

  console.log("Seeded 1 current user and 36 fictional profiles.");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
