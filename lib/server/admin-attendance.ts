import { db } from "@/lib/db"
import { attendance, staffAttendance, dailyReports } from "@/lib/schema"
import { desc } from "drizzle-orm"

export async function getAdminAttendanceData() {
  const pupilAttendance = await db.select().from(attendance).orderBy(desc(attendance.date));
  const staffAttendanceRecords = await db.select().from(staffAttendance).orderBy(desc(staffAttendance.date));
  const recentReports = await db.select().from(dailyReports).orderBy(desc(dailyReports.date)).limit(10);

  // Move aggregation logic HERE (not client)
  const summaries = calculateSummaries(pupilAttendance)

  return {
    pupilAttendance,
    staffAttendance: staffAttendanceRecords,
    summaries,
    recentReports
  }
}

function calculateSummaries(records: any[]) {
  const map = new Map()

  for (const r of records) {
    if (!map.has(r.studentId)) {
      map.set(r.studentId, { total: 0, present: 0 })
    }
    const entry = map.get(r.studentId)
    entry.total++
    if (r.status !== "Absent") entry.present++
  }

  return Array.from(map.entries()).map(([studentId, data]) => ({
    studentId,
    percent: data.total
      ? Math.round((data.present / data.total) * 100)
      : 0,
  }))
}
