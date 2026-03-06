"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export default function RecentActivityTable({ activity }: { activity: any[] }) {
  return (
    <Card className="col-span-1 shadow-sm flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Recent Results</CardTitle>
          <CardDescription>Latest results published by staff</CardDescription>
        </div>
        <Link href="/admin/results">
          <Button variant="ghost" size="sm" className="gap-1">
            View All <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Class</TableHead>
              <TableHead className="text-right">Avg Score</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activity.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No recent activity found.
                </TableCell>
              </TableRow>
            ) : (
              activity.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{item.studentName}</TableCell>
                  <TableCell className="text-muted-foreground">{item.class}</TableCell>
                  <TableCell className="text-right font-medium">{item.averageScore}%</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={item.status === "Published" ? "default" : "secondary"} className={item.status === "Published" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
