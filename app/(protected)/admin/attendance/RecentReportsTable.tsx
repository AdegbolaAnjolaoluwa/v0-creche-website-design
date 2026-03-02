"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function RecentReportsTable({ reports }: { reports: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Daily Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Content Preview</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.date}</TableCell>
                <TableCell>{report.submittedBy}</TableCell>
                <TableCell className="max-w-[200px] truncate">{report.content}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
