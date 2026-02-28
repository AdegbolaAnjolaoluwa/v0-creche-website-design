import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { attendance } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");
    const date = searchParams.get("date");

    let query = db.select().from(attendance);
    
    // Build dynamic query
    if (classId && date) {
        // @ts-ignore
        query = query.where(and(eq(attendance.classId, classId), eq(attendance.date, date)));
    } else if (classId) {
        // @ts-ignore
        query = query.where(eq(attendance.classId, classId));
    }

    const records = await query;
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as any)?.role;
    
    if (!userId || (role !== 'org:admin' && role !== 'org:staff')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { date, studentId, studentName, classId, status } = body;

    const newRecord = {
      id: nanoid(),
      date,
      studentId,
      studentName,
      classId,
      status,
      markedBy: userId,
      timestamp: Date.now(),
    };

    await db.insert(attendance).values(newRecord);

    return NextResponse.json({ success: true, record: newRecord });
  } catch (error) {
    console.error("Error creating attendance:", error);
    return NextResponse.json({ error: "Failed to create attendance" }, { status: 500 });
  }
}
