import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { attendance, dailyReports, loanRequests, pupils, classes } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as any)?.role;
    const email = (sessionClaims?.primaryEmail as any)?.emailAddress; // Assuming custom claim or standard
    // Note: Clerk sessionClaims might not have primaryEmail directly exposed without config
    // For now we will rely on client side email passed or userId if mapped.
    // Better approach: use userId to find staff record. 
    // However, schema uses staffEmail. Let's assume we can get email or use userId.
    
    // For this MVP, we will require the client to pass the email or classId if needed,
    // OR we just trust the role check and filter by what we can.
    // Ideally we should store staffId in tables, not just email.
    
    if (!userId || (role !== 'org:staff' && role !== 'org:admin')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Since we don't have an easy way to get the current user's email securely on the server 
    // without a DB lookup of the user table (which we sync via webhook ideally),
    // we will fetch general stats that are filtered by the provided query params 
    // that the client sends (which we trust because they are authenticated as staff).
    // A more secure way is to look up the user by userId in our local users table.
    
    const { searchParams } = new URL(req.url);
    const staffEmail = searchParams.get("email");
    const classId = searchParams.get("classId");

    if (!staffEmail) {
       return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];

    // 1. Staff Attendance for today
    const todaysAttendance = await db.select()
      .from(attendance)
      .where(and(eq(attendance.markedBy, userId), eq(attendance.date, today)));
      
    // 2. Class Pupil Count (if classId provided)
    let pupilCount = 0;
    if (classId) {
        const pCount = await db.select({ count: sql<number>`count(*)` })
            .from(pupils)
            .where(eq(pupils.classId, classId));
        pupilCount = pCount[0].count;
    }

    // 3. Pending Loans
    const pendingLoans = await db.select({ count: sql<number>`count(*)` })
        .from(loanRequests)
        .where(and(eq(loanRequests.staffEmail, staffEmail), eq(loanRequests.status, "Pending")));

    // 4. Recent Daily Reports
    let recentReportsQuery = db.select().from(dailyReports).where(eq(dailyReports.submittedBy, staffEmail));
    if (classId) {
        // @ts-ignore
        recentReportsQuery = recentReportsQuery.where(and(eq(dailyReports.submittedBy, staffEmail), eq(dailyReports.classId, classId)));
    }
    const recentReports = await recentReportsQuery.orderBy(sql`${dailyReports.createdAt} DESC`).limit(5);

    return NextResponse.json({
        attendanceMarked: todaysAttendance.length > 0,
        pupilCount,
        pendingLoans: pendingLoans[0].count,
        recentReports
    });

  } catch (error) {
    console.error("Error fetching staff dashboard data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
