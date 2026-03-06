import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dailyReports } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check for admin role ideally
    const allReports = await db.select().from(dailyReports).orderBy(desc(dailyReports.date));
    return NextResponse.json(allReports);
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { date, studentId, classId, content, submittedBy } = body;

    if (!date || !classId || !content || !submittedBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newReport = await db.insert(dailyReports).values({
      id: crypto.randomUUID(),
      date,
      studentId: studentId || "all",
      classId,
      content: JSON.stringify(content),
      submittedBy,
      createdAt: Date.now(),
    }).returning();

    return NextResponse.json(newReport[0]);
  } catch (error) {
    console.error("Failed to create report:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
