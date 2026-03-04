import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { staffAttendance } from "@/lib/schema";
import { eq, desc, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const attendanceSchema = z.object({
  email: z.string().email(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
});

export async function GET(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as any)?.role;

    if (!userId || (role !== 'org:staff' && role !== 'org:admin')) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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
    if (process.env.NODE_ENV !== 'production') console.error("Error fetching staff attendance:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    try {
        const { userId, sessionClaims } = await auth();
        const role = (sessionClaims?.metadata as any)?.role;

        if (!userId || (role !== 'org:staff' && role !== 'org:admin')) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const validation = attendanceSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Invalid payload", details: validation.error.flatten() }, { status: 400 });
        }

        const { email, date, time } = validation.data;

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
        if (process.env.NODE_ENV !== 'production') console.error("Error marking staff attendance:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
