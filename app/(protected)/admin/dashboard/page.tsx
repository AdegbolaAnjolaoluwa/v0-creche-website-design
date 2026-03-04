import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getAdminDashboardData } from "@/lib/server/admin-dashboard"
import DashboardCharts from "./DashboardCharts"
import RecentActivityTable from "./RecentActivityTable"
import DashboardMetrics from "./DashboardMetrics"

export default async function AdminDashboard() {
  const { userId, sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as any)?.role

  if (!userId || role !== "org:admin") {
    redirect("/login")
  }

  const data = await getAdminDashboardData()

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of school performance</p>
      </div>

      <DashboardMetrics metrics={data.metrics} />

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCharts charts={data.charts} />
        <RecentActivityTable activity={data.recentActivity} />
      </div>
    </div>
  )
}
