import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pupils, staffAttendance, loanRequests, dailyReports } from "@/lib/schema";
import { eq, and, count, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");
    const classId = searchParams.get("classId");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const today = new Date().toISOString().slice(0, 10);

    // 1. Pupil Count
    // If classId is provided, filter by class, otherwise get all?
    // Staff usually see their own class.
    let pupilCount = 0;
    if (classId) {
        // Since we don't have a direct count query easily without raw sql in some versions,
        // we can select id and count.
        const p = await db.select({ id: pupils.id }).from(pupils).where(eq(pupils.classId, classId));
        pupilCount = p.length;
    }

    // 2. Attendance Marked Today
    const attendance = await db.select()
        .from(staffAttendance)
        .where(and(
            eq(staffAttendance.staffEmail, email),
            eq(staffAttendance.date, today)
        ));
    const attendanceMarked = attendance.length > 0;

    // 3. Pending Loans
    const loans = await db.select()
        .from(loanRequests)
        .where(and(
            eq(loanRequests.staffEmail, email),
            eq(loanRequests.status, "Pending")
        ));
    const pendingLoans = loans.length;

    // 4. Recent Reports (Last 5)
    const reports = await db.select()
        .from(dailyReports)
        .where(eq(dailyReports.submittedBy, email))
        .orderBy(desc(dailyReports.createdAt))
        .limit(5);

    return NextResponse.json({
      pupilCount,
      attendanceMarked,
      pendingLoans,
      recentReports: reports
    });

  } catch (error) {
    console.error("Error fetching staff dashboard data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
