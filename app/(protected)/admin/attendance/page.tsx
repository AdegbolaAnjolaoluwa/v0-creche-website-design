import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getAdminAttendanceData } from "@/lib/server/admin-attendance"
import AttendanceFilters from "./AttendanceFilters"
import PupilAttendanceTable from "./PupilAttendanceTable"
import StaffAttendanceTable from "./StaffAttendanceTable"
import OverviewCards from "./OverviewCards"
import RecentReportsTable from "./RecentReportsTable"

export default async function AdminAttendancePage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/login")
  }

  const data = await getAdminAttendanceData()

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold">Attendance Management</h1>
      </div>

      <AttendanceFilters />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <PupilAttendanceTable data={data.pupilAttendance} />
        <StaffAttendanceTable data={data.staffAttendance} />
      </div>

      <OverviewCards summaries={data.summaries} />

      <RecentReportsTable reports={data.recentReports} />
    </div>
  )
}
