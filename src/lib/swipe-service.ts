import { Prisma, PrismaClient } from "@prisma/client";
import type { ProfileDto, SwipeDirection } from "@/lib/types";
import { toProfileDto } from "@/lib/profile";

export class DuplicateSwipeError extends Error {
  constructor() {
    super("This profile has already been swiped");
  }
}

export class SelfSwipeError extends Error {
  constructor() {
    super("A user cannot swipe on themselves");
  }
}

export async function getFeed(
  db: PrismaClient,
  currentUserId: string,
): Promise<ProfileDto[]> {
  const swiped = await db.swipe.findMany({
    where: { actorId: currentUserId },
    select: { targetId: true },
  });

  const swipedIds = swiped.map((swipe) => swipe.targetId);
  const profiles = await db.user.findMany({
    where: {
      id: { not: currentUserId, notIn: swipedIds },
      isCurrent: false,
    },
    orderBy: { createdAt: "asc" },
  });

  return profiles.map(toProfileDto);
}

export async function recordSwipe(
  db: PrismaClient,
  currentUserId: string,
  targetProfileId: string,
  direction: SwipeDirection,
): Promise<{ matched: boolean; profile: ProfileDto | null }> {
  if (targetProfileId === currentUserId) throw new SelfSwipeError();

  const existing = await db.swipe.findUnique({
    where: {
      actorId_targetId: { actorId: currentUserId, targetId: targetProfileId },
    },
  });
  if (existing) throw new DuplicateSwipeError();

  try {
    return await db.$transaction(async (tx) => {
      const target = await tx.user.findUnique({ where: { id: targetProfileId } });
      if (!target || target.isCurrent) {
        throw new Error("Profile not found");
      }

      await tx.swipe.create({
        data: { actorId: currentUserId, targetId: targetProfileId, direction },
      });

      if (direction === "PASS") return { matched: false, profile: null };

      const reciprocal = await tx.swipe.findUnique({
        where: {
          actorId_targetId: { actorId: targetProfileId, targetId: currentUserId },
        },
      });

      if (!reciprocal || reciprocal.direction !== "LIKE") {
        return { matched: false, profile: null };
      }

      const [userAId, userBId] =
        currentUserId < targetProfileId
          ? [currentUserId, targetProfileId]
          : [targetProfileId, currentUserId];

      await tx.match.create({
        data: { userAId, userBId },
      }).catch((error: unknown) => {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          return null;
        }
        throw error;
      });

      return { matched: true, profile: toProfileDto(target) };
    });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new DuplicateSwipeError();
    }
    throw error;
  }
}

export async function getMatches(
  db: PrismaClient,
  currentUserId: string,
) {
  const matches = await db.match.findMany({
    where: {
      OR: [{ userAId: currentUserId }, { userBId: currentUserId }],
    },
    include: { userA: true, userB: true },
    orderBy: { createdAt: "desc" },
  });

  return matches.map((match) => {
    const profile =
      match.userAId === currentUserId ? match.userB : match.userA;
    return {
      id: match.id,
      profile: toProfileDto(profile),
      matchedAt: match.createdAt.toISOString(),
    };
  });
}
