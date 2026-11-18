import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { swipeSchema } from "@/lib/validation";
import {
  DuplicateSwipeError,
  recordSwipe,
  SelfSwipeError,
} from "@/lib/swipe-service";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = swipeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid swipe", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await recordSwipe(
      prisma,
      "current-user",
      parsed.data.targetProfileId,
      parsed.data.direction,
    );

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof SelfSwipeError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof DuplicateSwipeError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    console.error("POST /swipe failed", error);
    return NextResponse.json(
      { error: "Unable to record swipe" },
      { status: 500 },
    );
  }
}
