import { db } from "@/lib/db";
import { pupils, results, attendance, classes, loanRequests, dailyReports } from "@/lib/schema";
import { eq, sql, desc, avg, count } from "drizzle-orm";

export async function getAdminDashboardData() {
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
  const gradeDistribution = await db.select({
    grade: results.grade,
    count: count(results.id)
  })
  .from(results)
  .where(eq(results.status, 'Published'))
  .groupBy(results.grade);

  const classPerformance = await db.select({
    className: classes.name,
    averageScore: avg(results.averageScore)
  })
  .from(results)
  .leftJoin(classes, eq(results.classId, classes.id))
  .where(eq(results.status, 'Published'))
  .groupBy(classes.name);

  const termPerformance = await db.select({
    term: results.term,
    averageScore: avg(results.averageScore)
  })
  .from(results)
  .where(eq(results.status, 'Published'))
  .groupBy(results.term);

  const attendanceStats = await db.select({
    status: attendance.status,
    count: count(attendance.id)
  })
  .from(attendance)
  .groupBy(attendance.status);

  const loanStats = await db.select({
    status: loanRequests.status,
    count: count(loanRequests.id)
  })
  .from(loanRequests)
  .groupBy(loanRequests.status);

  const reportsCount = await db.select({ count: count(dailyReports.id) }).from(dailyReports);

  return {
    metrics: {
      totalPupils: pupilsCount[0].count,
      totalClasses: classesCount[0].count,
      totalResults: totalResultsCount[0].count,
      totalPublishedResults: publishedResultsCount[0].count,
      totalDraftResults: draftResultsCount[0].count,
      averageScore: Math.round(averageScoreResult[0].avg || 0),
      todaysAttendance: todaysAttendance[0].count
    },
    recentActivity: recentResults,
    charts: {
      gradeDistribution,
      classPerformance: classPerformance.map(c => ({ className: c.className || "Unknown", averageScore: Math.round(Number(c.averageScore) || 0) })),
      termPerformance: termPerformance.map(t => ({ term: t.term, averageScore: Math.round(Number(t.averageScore) || 0) })),
      attendanceStats,
      loanStats,
      totalReports: reportsCount[0].count
    }
  };
}
