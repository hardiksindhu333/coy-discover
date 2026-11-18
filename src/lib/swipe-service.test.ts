import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import {
  DuplicateSwipeError,
  getFeed,
  getMatches,
  recordSwipe,
  SelfSwipeError,
} from "@/lib/swipe-service";

const db = new PrismaClient();
const currentId = "test-current";
const profileA = "test-profile-a";
const profileB = "test-profile-b";

async function resetUsers() {
  await db.match.deleteMany();
  await db.swipe.deleteMany();
  await db.user.deleteMany();

  await db.user.createMany({
    data: [
      {
        id: currentId,
        name: "Alex",
        age: 24,
        photoUrl: "current.jpg",
        bio: "Test current user",
        city: "New York",
        college: "Columbia",
        interests: JSON.stringify(["Coffee"]),
        isCurrent: true,
      },
      {
        id: profileA,
        name: "Asha",
        age: 23,
        photoUrl: "asha.jpg",
        bio: "Test profile A",
        city: "Boston",
        college: "BU",
        interests: JSON.stringify(["Books"]),
      },
      {
        id: profileB,
        name: "Ben",
        age: 26,
        photoUrl: "ben.jpg",
        bio: "Test profile B",
        city: "Chicago",
        college: "UChicago",
        interests: JSON.stringify(["Running"]),
      },
    ],
  });
}

beforeAll(async () => {
  await resetUsers();
});

beforeEach(async () => {
  await resetUsers();
});

afterAll(async () => {
  await db.$disconnect();
});

describe("matching and privacy", () => {
  it("does not match a one-sided LIKE", async () => {
    const result = await recordSwipe(db, currentId, profileA, "LIKE");

    expect(result.matched).toBe(false);
    expect(await db.match.count()).toBe(0);
  });

  it("never creates a match for PASS", async () => {
    await db.swipe.create({
      data: { actorId: profileA, targetId: currentId, direction: "LIKE" },
    });
    const result = await recordSwipe(db, currentId, profileA, "PASS");

    expect(result.matched).toBe(false);
    expect(await db.match.count()).toBe(0);
  });

  it("creates a match only for a mutual LIKE", async () => {
    await db.swipe.create({
      data: { actorId: profileA, targetId: currentId, direction: "LIKE" },
    });
    const result = await recordSwipe(db, currentId, profileA, "LIKE");

    expect(result.matched).toBe(true);
    expect(result.profile?.name).toBe("Asha");
    expect(await db.match.count()).toBe(1);
  });

  it("rejects duplicate swipes and self-swipes", async () => {
    await recordSwipe(db, currentId, profileA, "PASS");

    await expect(
      recordSwipe(db, currentId, profileA, "LIKE"),
    ).rejects.toBeInstanceOf(DuplicateSwipeError);
    await expect(
      recordSwipe(db, currentId, currentId, "LIKE"),
    ).rejects.toBeInstanceOf(SelfSwipeError);
  });

  it("keeps incoming and non-mutual likes private", async () => {
    await db.swipe.create({
      data: { actorId: profileA, targetId: currentId, direction: "LIKE" },
    });

    const matches = await getMatches(db, currentId);
    expect(matches).toEqual([]);
  });

  it("removes swiped profiles from the feed", async () => {
    await recordSwipe(db, currentId, profileA, "PASS");

    const feed = await getFeed(db, currentId);
    expect(feed.map((profile) => profile.id)).not.toContain(profileA);
    expect(feed.map((profile) => profile.id)).toContain(profileB);
  });

  it("persists matches across a new database client", async () => {
    await db.swipe.create({
      data: { actorId: profileB, targetId: currentId, direction: "LIKE" },
    });
    await recordSwipe(db, currentId, profileB, "LIKE");

    const reloadedDb = new PrismaClient();
    const matches = await getMatches(reloadedDb, currentId);
    await reloadedDb.$disconnect();

    expect(matches).toHaveLength(1);
    expect(matches[0].profile.id).toBe(profileB);
  });

  it("prevents duplicate matches", async () => {
    await db.swipe.create({
      data: { actorId: profileA, targetId: currentId, direction: "LIKE" },
    });
    await recordSwipe(db, currentId, profileA, "LIKE");

    await expect(
      recordSwipe(db, currentId, profileA, "LIKE"),
    ).rejects.toBeInstanceOf(DuplicateSwipeError);
    expect(await db.match.count()).toBe(1);
  });
});
