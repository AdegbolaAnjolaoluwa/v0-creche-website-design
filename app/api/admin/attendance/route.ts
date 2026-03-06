import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { attendance } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

// Mock data for seeding
const mockAttendance = [
  {
    id: "att_1",
    date: new Date().toISOString().split('T')[0],
    studentId: "BPS-001",
    studentName: "Agboola Jasmine",
    classId: "Nursery 2",
    status: "Present",
    markedBy: "admin",
    timestamp: Date.now()
  },
  {
    id: "att_2",
    date: new Date().toISOString().split('T')[0],
    studentId: "BPS-002",
    studentName: "Ewuzie Angela",
    classId: "Nursery 2",
    status: "Present",
    markedBy: "admin",
    timestamp: Date.now()
  },
  {
    id: "att_3",
    date: new Date().toISOString().split('T')[0],
    studentId: "BPS-003",
    studentName: "Chimezie Dominion",
    classId: "Nursery 2",
    status: "Absent",
    markedBy: "admin",
    timestamp: Date.now()
  }
];

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");
    const date = searchParams.get("date");

    // Check if attendance table is empty
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(attendance);
    const count = countResult[0].count;

    if (count === 0) {
      console.log("Seeding attendance database...");
      await db.insert(attendance).values(mockAttendance);
    }

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
