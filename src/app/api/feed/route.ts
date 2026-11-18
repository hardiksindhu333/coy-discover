import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFeed } from "@/lib/swipe-service";

export async function GET() {
  try {
    const profiles = await getFeed(prisma, "current-user");
    return NextResponse.json(profiles);
  } catch (error) {
    console.error("GET /feed failed", error);
    return NextResponse.json(
      { error: "Unable to load profiles" },
      { status: 500 },
    );
  }
}
