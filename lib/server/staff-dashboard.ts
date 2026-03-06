import { db } from "@/lib/db";
import { staffAttendance, dailyReports, pupils, loanRequests, classes } from "@/lib/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export async function getStaffDashboardData(email: string, classId: string) {
  const today = new Date().toISOString().split('T')[0];

  const getData = unstable_cache(
    async () => {
        const hasDbEnv = Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
        if (!hasDbEnv) {
          return {
            attendanceMarked: false,
            pupilCount: 0,
            pendingLoans: 0,
            recentReports: [],
            className: classId
          };
        }

        try {
        const [
            attendanceCheck,
            pupilCount,
            loanCheck,
            recentReports,
            classDetails
          ] = await Promise.all([
            db.select().from(staffAttendance)
              .where(and(eq(staffAttendance.staffEmail, email), eq(staffAttendance.date, today))),
            
            db.select({ count: sql<number>`count(*)` }).from(pupils).where(eq(pupils.classId, classId)), 
            
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
            className: classDetails[0]?.name || classId 
          };
        } catch {
          return {
            attendanceMarked: false,
            pupilCount: 0,
            pendingLoans: 0,
            recentReports: [],
            className: classId
          };
        }
    },
    [`staff-dashboard-${email}-${classId}`],
    { revalidate: 30 }
  );

  return await getData();
}
