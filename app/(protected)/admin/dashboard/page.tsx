import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getAdminDashboardData } from "@/lib/server/admin-dashboard"
import DashboardCharts from "./DashboardCharts"
import RecentActivityTable from "./RecentActivityTable"
import DashboardMetrics from "./DashboardMetrics"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Download, UserPlus } from "lucide-react"

export default async function AdminDashboard() {
  const { userId, sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as any)?.role

  if (!userId || role !== "org:admin") {
    redirect("/login")
  }

  const data = await getAdminDashboardData()

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 bg-slate-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e2b6d]">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of school performance and activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/pupils?new=true">
            <Button className="bg-[#1e2b6d] hover:bg-[#2a3c8f] gap-1">
              <UserPlus className="h-4 w-4" /> Add Pupil
            </Button>
          </Link>
          <Link href="/admin/results/new">
            <Button variant="outline" className="gap-1 border-[#1e2b6d] text-[#1e2b6d] hover:bg-[#1e2b6d]/5">
              <Plus className="h-4 w-4" /> New Result
            </Button>
          </Link>
        </div>
      </div>

      <DashboardMetrics metrics={data.metrics} />

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCharts charts={data.charts} />
        <RecentActivityTable activity={data.recentActivity} />
      </div>
    </div>
  )
}
