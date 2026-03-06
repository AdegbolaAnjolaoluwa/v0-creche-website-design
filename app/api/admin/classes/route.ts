import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { classes } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allClasses = await db.select().from(classes).orderBy(desc(classes.createdAt));
    return NextResponse.json(allClasses);
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as any)?.role;
    
    if (!userId || role !== 'org:admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, ageRange, capacity } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newClass = {
      id: nanoid(),
      name,
      description,
      ageRange,
      capacity: capacity ? parseInt(capacity) : null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.insert(classes).values(newClass);

    return NextResponse.json({ success: true, class: newClass });
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
  }
}
