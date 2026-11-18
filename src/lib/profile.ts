import type { User } from "@prisma/client";
import type { ProfileDto } from "@/lib/types";

export function toProfileDto(user: User): ProfileDto {
  let interests: string[] = [];
  try {
    interests = JSON.parse(user.interests) as string[];
  } catch {
    interests = [];
  }

  return {
    id: user.id,
    name: user.name,
    age: user.age,
    photoUrl: user.photoUrl,
    bio: user.bio,
    city: user.city,
    college: user.college,
    interests,
  };
}
