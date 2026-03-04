"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function RecentActivityTable({ activity }: { activity: any[] }) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Avg Score</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activity.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.studentName}</TableCell>
                <TableCell>{item.class}</TableCell>
                <TableCell>{item.averageScore}%</TableCell>
                <TableCell>
                  <Badge variant={item.status === "Published" ? "default" : "secondary"}>
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
