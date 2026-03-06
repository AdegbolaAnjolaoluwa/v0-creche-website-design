"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, FileText, CheckCircle, File, Activity, Calendar, ArrowUpRight, TrendingUp } from "lucide-react"

export default function DashboardMetrics({ metrics }: { metrics: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-[#1e2b6d] shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Pupils</CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
             <Users className="h-4 w-4 text-[#1e2b6d]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#1e2b6d]">{metrics.totalPupils}</div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-green-600 font-medium">+2%</span> 
            <span className="ml-1">from last month</span>
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-[#facc15] shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Classes</CardTitle>
          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-yellow-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#1e2b6d]">{metrics.totalClasses}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Across all levels
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-[#22c55e] shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Results Status</CardTitle>
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#1e2b6d]">{metrics.totalPublishedResults}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <span className="text-amber-600 font-medium mr-1">{metrics.totalDraftResults}</span>
            <span>drafts pending review</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Today's Attendance</CardTitle>
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#1e2b6d]">{metrics.todaysAttendance}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Pupils present today
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
