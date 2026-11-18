export type SwipeDirection = "LIKE" | "PASS";

export interface ProfileDto {
  id: string;
  name: string;
  age: number;
  photoUrl: string;
  bio: string;
  city: string;
  college: string;
  interests: string[];
}

export interface MatchDto {
  id: string;
  profile: ProfileDto;
  matchedAt: string;
}
