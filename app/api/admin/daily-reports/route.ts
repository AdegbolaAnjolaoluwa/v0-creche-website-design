import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dailyReports } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

// Mock data for seeding
const mockReports = [
  {
    id: "rep_1",
    date: new Date().toISOString().split('T')[0],
    studentId: "all",
    classId: "Nursery 2",
    content: JSON.stringify({
      topicsTaught: "Numbers 1-10",
      incidentReport: "None",
      homework: "Trace numbers",
      generalComment: "Great day overall"
    }),
    submittedBy: "staff@example.com",
    createdAt: Date.now()
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

    // Check if reports table is empty
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(dailyReports);
    const count = countResult[0].count;

    if (count === 0) {
      console.log("Seeding daily reports database...");
      await db.insert(dailyReports).values(mockReports);
    }

    let query = db.select().from(dailyReports);
    
    // Build dynamic query
    if (classId && date) {
        // @ts-ignore
        query = query.where(and(eq(dailyReports.classId, classId), eq(dailyReports.date, date)));
    } else if (classId) {
        // @ts-ignore
        query = query.where(eq(dailyReports.classId, classId));
    }

    const records = await query;
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
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
    const { date, studentId, classId, content, submittedBy } = body;

    const newReport = {
      id: nanoid(),
      date,
      studentId: studentId || "all",
      classId,
      content: typeof content === 'string' ? content : JSON.stringify(content),
      submittedBy: submittedBy || userId,
      createdAt: Date.now(),
    };

    await db.insert(dailyReports).values(newReport);

    return NextResponse.json({ success: true, report: newReport });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }
}
