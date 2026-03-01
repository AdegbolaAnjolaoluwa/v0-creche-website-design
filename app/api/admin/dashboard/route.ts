import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pupils, results, attendance, classes, loanRequests, dailyReports } from "@/lib/schema";
import { eq, sql, desc, avg, count } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as any)?.role;

    if (!userId || role !== "org:admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parallel fetch for dashboard metrics
    const [
      pupilsCount,
      classesCount,
      totalResultsCount,
      publishedResultsCount,
      draftResultsCount,
      averageScoreResult,
      todaysAttendance
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(pupils),
      db.select({ count: sql<number>`count(*)` }).from(classes),
      db.select({ count: sql<number>`count(*)` }).from(results),
      db.select({ count: sql<number>`count(*)` }).from(results).where(eq(results.status, 'Published')),
      db.select({ count: sql<number>`count(*)` }).from(results).where(eq(results.status, 'Draft')),
      db.select({ avg: sql<number>`avg(${results.averageScore})` }).from(results).where(eq(results.status, 'Published')),
      db.select({ count: sql<number>`count(*)` }).from(attendance)
        .where(sql`date(${attendance.timestamp} / 1000, 'unixepoch') = date('now')`)
    ]);

    // Fetch recent activities with Class Name
    const recentResults = await db.select({
      id: results.id,
      studentName: results.studentName,
      class: classes.name,
      term: results.term,
      averageScore: results.averageScore,
      createdAt: results.createdAt,
      status: results.status,
      subjects: results.subjects
    })
      .from(results)
      .leftJoin(classes, eq(results.classId, classes.id))
      .orderBy(sql`${results.createdAt} DESC`)
      .limit(5);

    // Aggregations for Charts
    
    // 1. Grade Distribution
    const gradeDistribution = await db.select({
      grade: results.grade,
      count: count(results.id)
    })
    .from(results)
    .where(eq(results.status, 'Published'))
    .groupBy(results.grade);

    // 2. Class Performance
    const classPerformance = await db.select({
      className: classes.name,
      averageScore: avg(results.averageScore)
    })
    .from(results)
    .leftJoin(classes, eq(results.classId, classes.id))
    .where(eq(results.status, 'Published'))
    .groupBy(classes.name);

    // 3. Term Performance
    const termPerformance = await db.select({
      term: results.term,
      averageScore: avg(results.averageScore)
    })
    .from(results)
    .where(eq(results.status, 'Published'))
    .groupBy(results.term);

    // 4. Attendance Overview (Overall % Present)
    const attendanceStats = await db.select({
      status: attendance.status,
      count: count(attendance.id)
    })
    .from(attendance)
    .groupBy(attendance.status);

    // 5. Loan Requests Status
    const loanStats = await db.select({
      status: loanRequests.status,
      count: count(loanRequests.id)
    })
    .from(loanRequests)
    .groupBy(loanRequests.status);

    // 6. Daily Reports Count
    const reportsCount = await db.select({ count: count(dailyReports.id) }).from(dailyReports);

    return NextResponse.json({
      metrics: {
        totalPupils: pupilsCount[0].count,
        totalClasses: classesCount[0].count,
        totalResults: totalResultsCount[0].count,
        totalPublishedResults: publishedResultsCount[0].count,
        totalDraftResults: draftResultsCount[0].count,
        averageScore: averageScoreResult[0].avg || 0,
        todaysAttendance: todaysAttendance[0].count,
      },
      recentActivity: recentResults,
      charts: {
        gradeDistribution,
        classPerformance,
        termPerformance,
        attendanceStats,
        loanStats,
        totalReports: reportsCount[0].count
      }
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
