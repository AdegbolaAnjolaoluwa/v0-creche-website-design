"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useClerk, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { BookOpen, Calendar, ChevronDown, Edit, Filter, Home, Trash, User, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { classesData, pupilsData } from "@/lib/data"

type CurrentUser = {
  role: string
  email?: string
}

type StaffAttendanceRecord = {
  id: string
  staffEmail: string
  date: string
  time: string
  createdAt: string
}

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

type DailyReport = {
  id: string
  staffEmail: string
  classId: string
  date: string
  topicsTaught: string
  activitiesDone: string
  behaviourNotes: string
  homework: string
  generalComment: string
  createdAt: string
}

const STAFF_ATTENDANCE_KEY = "staffAttendance"
const PUPIL_ATTENDANCE_KEY = "pupilAttendance"
const DAILY_REPORTS_KEY = "dailyReports"

export default function AdminAttendancePage() {
  const { signOut } = useClerk()
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  
  const currentUser = useMemo(() => {
    if (!user) return null
    return {
      role: (user.publicMetadata.role as string) || "admin",
      email: user.primaryEmailAddress?.emailAddress,
    }
  }, [user])

  const [staffAttendance, setStaffAttendance] = useState<StaffAttendanceRecord[]>([])
  const [pupilAttendance, setPupilAttendance] = useState<PupilAttendanceRecord[]>([])
  const [filterDate, setFilterDate] = useState("")
  const [filterClassId, setFilterClassId] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterStaffEmail, setFilterStaffEmail] = useState("")
  const [editingRecords, setEditingRecords] = useState<Record<string, PupilAttendanceRecord["status"]>>({})
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/login?type=admin")
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    fetchAttendance()
  }, [])

  const fetchAttendance = async () => {
    setIsLoading(true)
    try {
        // Fetch Pupil Attendance
        const resPupil = await fetch("/api/admin/attendance")
        if (resPupil.ok) {
            const data = await resPupil.json()
            const mapped = data.map((r: any) => ({
                id: r.id,
                pupilId: r.studentId,
                classId: r.classId,
                staffEmail: r.markedBy,
                date: r.date,
                time: "00:00", // Default as DB stores only date for now
                status: r.status,
                createdAt: new Date(r.timestamp).toISOString()
            }))
            setPupilAttendance(mapped)
        }

        // Fetch Staff Attendance (We need a new admin endpoint or reuse staff one if admin allows)
        // Let's create a quick admin endpoint for all staff attendance or reuse the pattern
        // For now, I'll mock it empty or we need to implement GET /api/admin/staff-attendance
        setStaffAttendance([]) 

    } catch (e) {
        console.error("Failed to fetch attendance", e)
    } finally {
        setIsLoading(false)
    }
  }

  const filteredPupilAttendance = useMemo(() => {
    return pupilAttendance.filter((record) => {
      if (filterDate && record.date !== filterDate) return false
      if (filterClassId !== "all" && record.classId !== filterClassId) return false
      if (filterStatus !== "all" && record.status !== filterStatus) return false
      const staffEmail = (record.staffEmail || "").toLowerCase()
      const staffFilter = (filterStaffEmail || "").toLowerCase()
      if (filterStaffEmail && !staffEmail.includes(staffFilter)) return false
      return true
    })
  }, [pupilAttendance, filterDate, filterClassId, filterStatus, filterStaffEmail])

  const filteredStaffAttendance = useMemo(() => {
    return staffAttendance.filter((record) => {
      if (filterDate && record.date !== filterDate) return false
      const staffEmail = (record.staffEmail || "").toLowerCase()
      const staffFilter = (filterStaffEmail || "").toLowerCase()
      if (filterStaffEmail && !staffEmail.includes(staffFilter)) return false
      return true
    })
  }, [staffAttendance, filterDate, filterStaffEmail])

  const handlePupilStatusChange = (id: string, status: PupilAttendanceRecord["status"]) => {
    setEditingRecords((prev) => ({
      ...prev,
      [id]: status,
    }))
  }

  const handleSaveEdits = () => {
    if (Object.keys(editingRecords).length === 0) return
    const updated = pupilAttendance.map((record) => {
      const newStatus = editingRecords[record.id]
      if (!newStatus) return record
      return {
        ...record,
        status: newStatus,
      }
    })
    setPupilAttendance(updated)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PUPIL_ATTENDANCE_KEY, JSON.stringify(updated))
    }
    setEditingRecords({})
  }

  const handleDeletePupilRecord = (id: string) => {
    const updated = pupilAttendance.filter((record) => record.id !== id)
    setPupilAttendance(updated)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PUPIL_ATTENDANCE_KEY, JSON.stringify(updated))
    }
  }

  const handleDeleteStaffRecord = (id: string) => {
    const updated = staffAttendance.filter((record) => record.id !== id)
    setStaffAttendance(updated)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STAFF_ATTENDANCE_KEY, JSON.stringify(updated))
    }
  }

  const handleLogout = () => { signOut(() => { router.push("/login") }) }

  const today = new Date().toISOString().slice(0, 10)

  const pupilSummaries = useMemo(() => {
    const byPupil = new Map<
      string,
      {
        dates: Map<string, PupilAttendanceRecord["status"]>
      }
    >()
    pupilAttendance.forEach((record) => {
      if (!byPupil.has(record.pupilId)) {
        byPupil.set(record.pupilId, { dates: new Map() })
      }
      const entry = byPupil.get(record.pupilId)
      if (!entry) return
      entry.dates.set(record.date, record.status)
    })
    const summaries: {
      pupilId: string
      name: string
      classId: string
      className: string
      totalDays: number
      presentDays: number
      absentDays: number
      attendancePercent: number
    }[] = []
    byPupil.forEach((value, pupilId) => {
      const pupil = pupilsData.find((s) => s.id === pupilId)
      const className = pupil?.class || ""
      const cls = classesData.find((c) => c.name === className)
      const dates = Array.from(value.dates.entries())
      const totalDays = dates.length
      let presentDays = 0
      let absentDays = 0
      dates.forEach(([, status]) => {
        if (status === "Absent") {
          absentDays += 1
        } else {
          presentDays += 1
        }
      })
      const attendancePercent =
        totalDays > 0 ? Math.round(((presentDays / totalDays) * 100 + Number.EPSILON) * 10) / 10 : 0
      summaries.push({
        pupilId,
        name: pupil?.name || pupilId,
        classId: cls?.id || "",
        className: cls?.name || className || "",
        totalDays,
        presentDays,
        absentDays,
        attendancePercent,
      })
    })
    return summaries
  }, [pupilAttendance])

  const classAttendance = useMemo(() => {
    const map = new Map<
      string,
      {
        className: string
        totalPupils: number
        sumPercent: number
      }
    >()
    pupilSummaries.forEach((summary) => {
      if (!summary.classId) return
      const existing = map.get(summary.classId) ?? {
        className: summary.className,
        totalPupils: 0,
        sumPercent: 0,
      }
      map.set(summary.classId, {
        className: existing.className,
        totalPupils: existing.totalPupils + 1,
        sumPercent: existing.sumPercent + summary.attendancePercent,
      })
    })
    const rows = Array.from(map.entries()).map(([classId, value]) => ({
      classId,
      className: value.className,
      totalPupils: value.totalPupils,
      attendancePercent:
        value.totalPupils > 0
          ? Math.round(((value.sumPercent / value.totalPupils) + Number.EPSILON) * 10) / 10
          : 0,
    }))
    rows.sort((a, b) => (a.attendancePercent < b.attendancePercent ? 1 : -1))
    return rows
  }, [pupilSummaries])

  const atRiskPupils = useMemo(
    () =>
      pupilSummaries
        .filter((summary) => summary.totalDays > 0 && summary.attendancePercent < 75)
        .slice()
        .sort((a, b) => a.attendancePercent - b.attendancePercent)
        .slice(0, 10),
    [pupilSummaries],
  )

  const recentReports = useMemo(
    () =>
      dailyReports
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
        .slice(0, 10),
    [dailyReports],
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
            <Image
              src="/logo.jpg"
              alt="Bayhood Preparatory School logo"
              width={220}
              height={66}
              className="h-14 w-auto"
            />
          </Link>
        </div>
        <div className="flex-1"></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="relative h-8 flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline-block">{currentUser?.email || "Admin User"}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <div className="grid flex-1 md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r bg-muted/40 md:block">
          <nav className="grid gap-2 p-4 text-sm">
            <Link
              href="/admin/pupils"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Users className="h-4 w-4" />
              Pupils
            </Link>
            <Link
              href="/admin/results"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              Results
            </Link>
            <Link
              href="/admin/pupils"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Users className="h-4 w-4" />
              Pupils
            </Link>
            <Link
              href="/admin/classes"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H19"></path>
                <path d="M20 8c0-1.1-.9-2-2-2h-5"></path>
                <path d="M4 4v16"></path>
                <path d="M8 4h9"></path>
                <path d="M9 8h6"></path>
              </svg>
              Classes
            </Link>
            <Link
              href="/admin/attendance"
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
            >
              <Calendar className="h-4 w-4" />
              Attendance
            </Link>
            <Link
              href="/admin/daily-reports"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <BookOpen className="h-4 w-4" />
              Daily Reports
            </Link>
            <Link
              href="/admin/loan"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Calendar className="h-4 w-4" />
              Staff Loan
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M12 1v4"></path>
                <path d="M12 19v4"></path>
                <path d="M4.22 4.22l2.83 2.83"></path>
                <path d="M16.95 16.95l2.83 2.83"></path>
                <path d="M1 12h4"></path>
                <path d="M19 12h4"></path>
                <path d="M4.22 19.78l2.83-2.83"></path>
                <path d="M16.95 7.05l2.83-2.83"></path>
              </svg>
              Settings
            </Link>
          </nav>
        </aside>
        <main className="flex flex-col gap-6 p-4 md:gap-8 md:p-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Attendance Management</h1>
            <p className="text-muted-foreground">
              View and manage staff and pupil attendance across all classes. Today is {today}.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Filter attendance by date, class, status, or staff.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="filter-date">Date</Label>
                  <Input
                    id="filter-date"
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Select value={filterClassId} onValueChange={setFilterClassId}>
                    <SelectTrigger>
                      <SelectValue placeholder="All classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All classes</SelectItem>
                      {classesData.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Present">Present</SelectItem>
                      <SelectItem value="Absent">Absent</SelectItem>
                      <SelectItem value="Late">Late</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-staff">Staff email</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="filter-staff"
                      placeholder="Filter by staff email"
                      value={filterStaffEmail}
                      onChange={(e) => setFilterStaffEmail(e.target.value)}
                    />
                    <Filter className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Pupil Attendance</CardTitle>
                  <CardDescription>View and edit pupil attendance across all classes.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleSaveEdits} disabled={Object.keys(editingRecords).length === 0}>
                  <Edit className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-24">
                    <p className="text-muted-foreground">Loading attendance records...</p>
                  </div>
                ) : filteredPupilAttendance.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No pupil attendance records match the selected filters.
                  </div>
                ) : (
                  <div className="max-h-[420px] overflow-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Pupil</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Staff</TableHead>
                          <TableHead className="w-[80px] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPupilAttendance.map((record) => {
                          const pupil = pupilsData.find((s: any) => s.id === record.pupilId)
                          const cls = classesData.find((c) => c.id === record.classId)
                          const currentStatus = editingRecords[record.id] || record.status
                          return (
                            <TableRow key={record.id}>
                              <TableCell>{record.date}</TableCell>
                              <TableCell>{record.time}</TableCell>
                              <TableCell>{pupil?.name || record.pupilId}</TableCell>
                              <TableCell>{cls?.name || record.classId}</TableCell>
                              <TableCell>
                                <Select
                                  value={currentStatus}
                                  onValueChange={(value: PupilAttendanceRecord["status"]) =>
                                    handlePupilStatusChange(record.id, value)
                                  }
                                >
                                  <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Present">Present</SelectItem>
                                    <SelectItem value="Absent">Absent</SelectItem>
                                    <SelectItem value="Late">Late</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>{record.staffEmail}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => handleDeletePupilRecord(record.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Staff Attendance</CardTitle>
                <CardDescription>View daily sign-ins for all staff members.</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredStaffAttendance.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No staff attendance records match the selected filters.
                  </div>
                ) : (
                  <div className="max-h-[420px] overflow-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Staff Email</TableHead>
                          <TableHead className="w-[80px] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStaffAttendance.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{record.date}</TableCell>
                            <TableCell>{record.time}</TableCell>
                            <TableCell>{record.staffEmail}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => handleDeleteStaffRecord(record.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardHeader>
                <CardTitle>Class Attendance Overview</CardTitle>
                <CardDescription>Average attendance percentage for each class.</CardDescription>
              </CardHeader>
              <CardContent>
                {classAttendance.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No attendance data available yet.</div>
                ) : (
                  <div className="max-h-[320px] overflow-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Class</TableHead>
                          <TableHead>Pupils</TableHead>
                          <TableHead>Attendance %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {classAttendance.map((row) => (
                          <TableRow key={row.classId}>
                            <TableCell>{row.className}</TableCell>
                            <TableCell>{row.totalPupils}</TableCell>
                            <TableCell>{row.attendancePercent}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>At-Risk Pupils</CardTitle>
                <CardDescription>
                  Pupils with attendance below 75% based on recorded days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {atRiskPupils.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No pupils are currently flagged as at risk.
                  </div>
                ) : (
                  <div className="max-h-[320px] overflow-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Pupil</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Attendance %</TableHead>
                          <TableHead>Days</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {atRiskPupils.map((summary: any) => (
                          <TableRow key={summary.pupilId}>
                            <TableCell>{summary.name}</TableCell>
                            <TableCell>{summary.className}</TableCell>
                            <TableCell>{summary.attendancePercent}%</TableCell>
                            <TableCell>{summary.totalDays}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Daily Reports</CardTitle>
              <CardDescription>Latest daily reports submitted by staff across all classes.</CardDescription>
            </CardHeader>
            <CardContent>
              {recentReports.length === 0 ? (
                <div className="text-sm text-muted-foreground">No daily reports submitted yet.</div>
              ) : (
                <div className="max-h-[320px] overflow-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Staff</TableHead>
                        <TableHead>Topics taught</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentReports.map((report) => {
                        const cls = classesData.find((c) => c.id === report.classId)
                        return (
                          <TableRow key={report.id}>
                            <TableCell>{report.date}</TableCell>
                            <TableCell>{cls?.name || report.classId}</TableCell>
                            <TableCell>{report.staffEmail}</TableCell>
                            <TableCell className="max-w-[260px] truncate">{report.topicsTaught}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
