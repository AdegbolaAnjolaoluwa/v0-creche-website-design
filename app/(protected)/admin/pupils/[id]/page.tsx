"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Clock, FileText, Phone, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { pupilsData, type Pupil, type ResultRecord } from "@/lib/data"

// Types
type PupilAttendanceRecord = {
  id: string
  pupilId: string
  classId: string
  staffEmail: string
  date: string
  time: string
  status: "Present" | "Absent" | "Late"
  createdAt: string
}

export default function PupilProfilePage() {
  const router = useRouter()
  const params = useParams()
  const pupilId = params.id as string
  
  const [pupil, setPupil] = useState<Pupil | null>(null)
  const [attendance, setAttendance] = useState<PupilAttendanceRecord[]>([])
  const [results, setResults] = useState<ResultRecord[]>([])

  useEffect(() => {
    const fetchData = async () => {
        // 1. Find Pupil (Mock for now, ideally API)
        const foundPupil = pupilsData.find(p => p.id === pupilId)
        setPupil(foundPupil || null)

        // 2. Load Attendance from API
        try {
            const res = await fetch("/api/admin/attendance")
            if (res.ok) {
                const data = await res.json()
                const pupilAttendance = data
                    .filter((a: any) => a.studentId === pupilId)
                    .map((a: any) => ({
                        id: a.id,
                        pupilId: a.studentId,
                        classId: a.classId,
                        staffEmail: a.markedBy,
                        date: a.date,
                        time: "00:00",
                        status: a.status,
                        createdAt: new Date(a.timestamp).toISOString()
                    }))
                setAttendance(pupilAttendance.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()))
            }
        } catch (e) {
            console.error("Failed to fetch attendance", e)
        }

        // 3. Load Results from API
        try {
            const res = await fetch("/api/admin/results")
            if (res.ok) {
                const data = await res.json()
                const pupilResults = data
                    .filter((r: any) => r.studentId === pupilId)
                    .map((r: any) => ({
                        ...r,
                        class: r.classId,
                        pupilName: r.studentName,
                        pupilId: r.studentId,
                        date: new Date(r.updatedAt).toISOString().split('T')[0]
                    }))
                setResults(pupilResults.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()))
            }
        } catch (e) {
            console.error("Failed to fetch results", e)
        }
    }
    
    fetchData()
  }, [pupilId])

  if (!pupil) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold">Pupil Not Found</h1>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  // Calculate Attendance Stats
  const totalDays = attendance.length
  const presentDays = attendance.filter(a => a.status === "Present").length
  const lateDays = attendance.filter(a => a.status === "Late").length
  const absentDays = attendance.filter(a => a.status === "Absent").length
  const attendanceRate = totalDays > 0 ? Math.round(((presentDays + lateDays) / totalDays) * 100) : 0

  return (
    <div className="flex flex-col gap-6 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/pupils">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{pupil.name}</h1>
            <p className="text-muted-foreground">{pupil.id} • {pupil.class}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Gender:</span>
                <span className="font-medium">{pupil.gender}</span>
                
                <span className="text-muted-foreground">Date of Birth:</span>
                <span className="font-medium">{pupil.dateOfBirth}</span>
                
                <span className="text-muted-foreground">Enrollment:</span>
                <span className="font-medium">{pupil.enrollmentDate}</span>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2 text-sm">Guardians</h4>
                {pupil.guardians.map((g, i) => (
                  <div key={i} className="mb-2 text-sm">
                    <p className="font-medium">{g.name}</p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{g.contactNumber}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats & Tabs */}
          <div className="md:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{attendanceRate}%</div>
                  <p className="text-xs text-muted-foreground">{totalDays} days recorded</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Academic Results</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{results.length}</div>
                  <p className="text-xs text-muted-foreground">Terms completed</p>
                </CardContent>
              </Card>
               <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Status</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Active</div>
                  <p className="text-xs text-muted-foreground">Enrolled student</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="attendance" className="w-full">
              <TabsList>
                <TabsTrigger value="attendance">Attendance History</TabsTrigger>
                <TabsTrigger value="results">Academic Results</TabsTrigger>
              </TabsList>
              
              <TabsContent value="attendance">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Log</CardTitle>
                    <CardDescription>Recent attendance records for this student.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {attendance.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No attendance records found.</div>
                    ) : (
                      <div className="max-h-[400px] overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Time</TableHead>
                              <TableHead>Recorded By</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {attendance.map((record) => (
                              <TableRow key={record.id}>
                                <TableCell>{record.date}</TableCell>
                                <TableCell>
                                  <Badge variant={record.status === "Present" ? "default" : record.status === "Absent" ? "destructive" : "secondary"}>
                                    {record.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>{record.time}</TableCell>
                                <TableCell className="text-muted-foreground text-xs">{record.staffEmail}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="results">
                 <Card>
                  <CardHeader>
                    <CardTitle>Academic Performance</CardTitle>
                    <CardDescription>Term results and grades.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {results.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No results published yet.</div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Term</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Avg Score</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.map((res) => (
                            <TableRow key={res.id}>
                              <TableCell className="font-medium">{res.term}</TableCell>
                              <TableCell>{res.class}</TableCell>
                              <TableCell>{res.averageScore}%</TableCell>
                              <TableCell>
                                <Badge variant="outline">{res.grade}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={res.status === "Published" ? "default" : "secondary"}>{res.status}</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/admin/results/${res.id}/edit`}>
                                    View Details
                                  </Link>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
            </TabsContent>
            </Tabs>
          </div>
        </div>
    </div>
  )
}
