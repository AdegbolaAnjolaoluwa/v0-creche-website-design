import { db } from "@/lib/db";
import { staffAttendance, dailyReports, pupils, loanRequests, classes } from "@/lib/schema";
import { eq, and, sql, desc } from "drizzle-orm";

export async function getStaffDashboardData(email: string, classId: string) {
  const today = new Date().toISOString().split('T')[0];

  const [
    attendanceCheck,
    pupilCount,
    loanCheck,
    recentReports,
    classDetails
  ] = await Promise.all([
    db.select().from(staffAttendance)
      .where(and(eq(staffAttendance.staffEmail, email), eq(staffAttendance.date, today))),
    
    db.select({ count: sql<number>`count(*)` }).from(pupils).where(eq(pupils.classId, classId)), // Using classId for now
    
    db.select({ count: sql<number>`count(*)` }).from(loanRequests)
      .where(and(eq(loanRequests.staffEmail, email), eq(loanRequests.status, 'Pending'))),

    db.select().from(dailyReports)
      .where(eq(dailyReports.submittedBy, email))
      .orderBy(desc(dailyReports.date))
      .limit(5),
      
    db.select().from(classes).where(eq(classes.id, classId)).limit(1)
  ]);

  return {
    attendanceMarked: attendanceCheck.length > 0,
    pupilCount: pupilCount[0]?.count || 0,
    pendingLoans: loanCheck[0]?.count || 0,
    recentReports,
    className: classDetails[0]?.name || classId // Fallback to ID if not found (or if ID is actually the Name)
  };
}
