import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { staffAttendance } from "@/lib/schema";
import { eq, desc, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const records = await db.select()
        .from(staffAttendance)
        .where(eq(staffAttendance.staffEmail, email))
        .orderBy(desc(staffAttendance.createdAt));

    return NextResponse.json(records);

  } catch (error) {
    console.error("Error fetching staff attendance:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, date, time } = body;

        if (!email || !date || !time) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if already marked for this date
        const existing = await db.select().from(staffAttendance).where(
            and(
                eq(staffAttendance.staffEmail, email),
                eq(staffAttendance.date, date)
            )
        );

        if (existing.length > 0) {
            return NextResponse.json({ error: "Attendance already marked for today" }, { status: 409 });
        }

        const newRecord = {
            id: nanoid(),
            staffEmail: email,
            date,
            time,
            createdAt: Date.now()
        };

        await db.insert(staffAttendance).values(newRecord);

        return NextResponse.json({ success: true, record: newRecord });

    } catch (error) {
        console.error("Error marking staff attendance:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
