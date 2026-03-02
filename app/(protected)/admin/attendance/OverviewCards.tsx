"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OverviewCards({ summaries }: { summaries: any[] }) {
  // Simple aggregation for display
  const totalStudents = summaries.length
  const averageAttendance = totalStudents > 0 
    ? Math.round(summaries.reduce((acc, curr) => acc + curr.percent, 0) / totalStudents) 
    : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageAttendance}%</div>
        </CardContent>
      </Card>
      {/* Add more cards as needed */}
    </div>
  )
}
