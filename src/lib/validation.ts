import { z } from "zod";

export const swipeSchema = z.object({
  targetProfileId: z.string().trim().min(1),
  direction: z.enum(["LIKE", "PASS"]),
});

export type SwipeInput = z.infer<typeof swipeSchema>;
