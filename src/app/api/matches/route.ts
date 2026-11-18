import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMatches } from "@/lib/swipe-service";

export async function GET() {
  try {
    const matches = await getMatches(prisma, "current-user");
    return NextResponse.json(matches);
  } catch (error) {
    console.error("GET /matches failed", error);
    return NextResponse.json(
      { error: "Unable to load matches" },
      { status: 500 },
    );
  }
}
