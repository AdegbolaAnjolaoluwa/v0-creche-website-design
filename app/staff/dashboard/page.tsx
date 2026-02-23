"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BarChart3, BookOpen, Check, ChevronDown, Home, LogOut, Menu, User, Users, X } from "lucide-react"

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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { classesData } from "@/app/admin/classes/page"
import { studentsData } from "@/app/admin/students/page"

type CurrentUser = {
  role: string
  email?: string
  classId?: string
}

type StaffAttendanceRecord = {
  id: string
  staffEmail: string
  date: string
  time: string
  createdAt: string
}

type StudentAttendanceRecord = {
  id: string
  studentId: string
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
const STUDENT_ATTENDANCE_KEY = "studentAttendance"
const DAILY_REPORTS_KEY = "dailyReports"

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function formatTime(date: Date) {
  return date.toTimeString().slice(0, 8)
}

function isAfterSignInCutoff() {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  if (hours > 7) return true
  if (hours < 7) return false
  return minutes >= 45
}

export default function StaffDashboard() {
  const router = useRouter()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendanceRecord[]>([])
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendanceRecord[]>([])
  const [todayStatuses, setTodayStatuses] = useState<Record<string, StudentAttendanceRecord["status"]>>({})
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isSavingAttendance, setIsSavingAttendance] = useState(false)
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([])
  const [reportTopicsTaught, setReportTopicsTaught] = useState("")
  const [reportActivitiesDone, setReportActivitiesDone] = useState("")
  const [reportBehaviourNotes, setReportBehaviourNotes] = useState("")
  const [reportHomework, setReportHomework] = useState("")
  const [reportGeneralComment, setReportGeneralComment] = useState("")
  const [isSavingReport, setIsSavingReport] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const storedUser = window.localStorage.getItem("currentUser")
    if (!storedUser) {
      router.push("/login?type=staff")
      return
    }
    try {
      const parsed = JSON.parse(storedUser) as CurrentUser
      if (parsed.role !== "staff" || !parsed.classId) {
        router.push("/login?type=staff")
        return
      }
      setCurrentUser(parsed)
    } catch {
      router.push("/login?type=staff")
    }
  }, [router])

  useEffect(() => {
    if (typeof window === "undefined") return
    const storedStaff = window.localStorage.getItem(STAFF_ATTENDANCE_KEY)
    const storedStudent = window.localStorage.getItem(STUDENT_ATTENDANCE_KEY)
    const storedReports = window.localStorage.getItem(DAILY_REPORTS_KEY)
    if (storedStaff) {
      try {
        const parsed = JSON.parse(storedStaff) as StaffAttendanceRecord[]
        setStaffAttendance(parsed)
      } catch {
        setStaffAttendance([])
      }
    }
    if (storedStudent) {
      try {
        const parsed = JSON.parse(storedStudent) as StudentAttendanceRecord[]
        setStudentAttendance(parsed)
      } catch {
        setStudentAttendance([])
      }
    }
    if (storedReports) {
      try {
        const parsed = JSON.parse(storedReports) as DailyReport[]
        setDailyReports(parsed)
      } catch {
        setDailyReports([])
      }
    }
  }, [])

  useEffect(() => {
    if (!currentUser) return
    const today = formatDate(new Date())
    const todaysRecords = studentAttendance.filter(
      (record) => record.classId === currentUser.classId && record.date === today && record.staffEmail === currentUser.email,
    )
    const map: Record<string, StudentAttendanceRecord["status"]> = {}
    todaysRecords.forEach((record) => {
      map[record.studentId] = record.status
    })
    setTodayStatuses(map)
  }, [currentUser, studentAttendance])

  const assignedClass = useMemo(
    () => classesData.find((cls) => cls.id === currentUser?.classId),
    [currentUser?.classId],
  )

  const classStudents = useMemo(() => {
    if (!assignedClass) return []
    return studentsData.filter((student) => student.class === assignedClass.name)
  }, [assignedClass])

  const todayStaffAttendance = useMemo(() => {
    if (!currentUser) return []
    const today = formatDate(new Date())
    return staffAttendance.filter((record) => record.staffEmail === currentUser.email && record.date === today)
  }, [currentUser, staffAttendance])

  const recentStudentAttendance = useMemo(() => {
    if (!currentUser) return []
    const records = studentAttendance
      .filter((record) => record.classId === currentUser.classId && record.staffEmail === currentUser.email)
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return records.slice(0, 10)
  }, [currentUser, studentAttendance])

  const today = formatDate(new Date())

  const todaysReport = useMemo(() => {
    if (!currentUser) return undefined
    return dailyReports.find(
      (report) =>
        report.staffEmail === currentUser.email &&
        report.classId === currentUser.classId &&
        report.date === today,
    )
  }, [currentUser, dailyReports, today])

  const isSignInClosed = isAfterSignInCutoff()

  useEffect(() => {
    if (!todaysReport) {
      setReportTopicsTaught("")
      setReportActivitiesDone("")
      setReportBehaviourNotes("")
      setReportHomework("")
      setReportGeneralComment("")
      return
    }
    setReportTopicsTaught(todaysReport.topicsTaught)
    setReportActivitiesDone(todaysReport.activitiesDone)
    setReportBehaviourNotes(todaysReport.behaviourNotes)
    setReportHomework(todaysReport.homework)
    setReportGeneralComment(todaysReport.generalComment)
  }, [todaysReport])

  const myReports = useMemo(() => {
    if (!currentUser) return []
    const reports = dailyReports
      .filter((report) => report.staffEmail === currentUser.email && report.classId === currentUser.classId)
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
    return reports.slice(0, 10)
  }, [currentUser, dailyReports])

  const handleStaffSignIn = () => {
    if (!currentUser) return
    if (typeof window === "undefined") return
    if (isAfterSignInCutoff()) return
    const todayExisting = staffAttendance.some(
      (record) => record.staffEmail === currentUser.email && record.date === today,
    )
    if (todayExisting) return
    setIsSigningIn(true)
    const now = new Date()
    const date = formatDate(now)
    const time = formatTime(now)
    const createdAt = now.toISOString()
    const record: StaffAttendanceRecord = {
      id: `${currentUser.email}-${createdAt}`,
      staffEmail: currentUser.email || "",
      date,
      time,
      createdAt,
    }
    const updated = [...staffAttendance, record]
    setStaffAttendance(updated)
    window.localStorage.setItem(STAFF_ATTENDANCE_KEY, JSON.stringify(updated))
    setIsSigningIn(false)
  }

  const handleStatusChange = (studentId: string, status: StudentAttendanceRecord["status"]) => {
    setTodayStatuses((prev) => ({
      ...prev,
      [studentId]: status,
    }))
  }

  const handleSaveAttendance = () => {
    if (!currentUser) return
    if (typeof window === "undefined") return
    setIsSavingAttendance(true)
    const now = new Date()
    const date = formatDate(now)
    const time = formatTime(now)
    const createdAt = now.toISOString()
    const newRecords: StudentAttendanceRecord[] = []
    Object.entries(todayStatuses).forEach(([studentId, status]) => {
      if (!status) return
      const record: StudentAttendanceRecord = {
        id: `${studentId}-${createdAt}`,
        studentId,
        classId: currentUser.classId || "",
        staffEmail: currentUser.email || "",
        date,
        time,
        status,
        createdAt,
      }
      newRecords.push(record)
    })
    if (newRecords.length === 0) {
      setIsSavingAttendance(false)
      return
    }
    const updated = [...studentAttendance, ...newRecords]
    setStudentAttendance(updated)
    window.localStorage.setItem(STUDENT_ATTENDANCE_KEY, JSON.stringify(updated))
    setIsSavingAttendance(false)
  }

  const handleSaveReport = () => {
    if (!currentUser) return
    if (typeof window === "undefined") return
    setIsSavingReport(true)
    const now = new Date()
    const date = formatDate(now)
    const createdAt = now.toISOString()
    const existingIndex = dailyReports.findIndex(
      (report) =>
        report.staffEmail === currentUser.email &&
        report.classId === currentUser.classId &&
        report.date === date,
    )
    const baseReport: DailyReport = {
      id: `${currentUser.email}-${currentUser.classId}-${date}`,
      staffEmail: currentUser.email || "",
      classId: currentUser.classId || "",
      date,
      topicsTaught: reportTopicsTaught,
      activitiesDone: reportActivitiesDone,
      behaviourNotes: reportBehaviourNotes,
      homework: reportHomework,
      generalComment: reportGeneralComment,
      createdAt,
    }
    let updated: DailyReport[]
    if (existingIndex >= 0) {
      updated = dailyReports.slice()
      updated[existingIndex] = {
        ...updated[existingIndex],
        topicsTaught: baseReport.topicsTaught,
        activitiesDone: baseReport.activitiesDone,
        behaviourNotes: baseReport.behaviourNotes,
        homework: baseReport.homework,
        generalComment: baseReport.generalComment,
      }
    } else {
      updated = [...dailyReports, baseReport]
    }
    setDailyReports(updated)
    window.localStorage.setItem(DAILY_REPORTS_KEY, JSON.stringify(updated))
    setIsSavingReport(false)
  }

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("currentUser")
    }
    router.push("/login?type=staff")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/staff/dashboard"
                className="flex items-center gap-2 text-lg font-semibold"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <Image
                  src="/logo.jpg"
                  alt="Bayhood Preparatory School logo"
                  width={220}
                  height={66}
                  className="h-14 w-auto"
                />
              </Link>
              <div className="grid gap-3">
                <Link
                  href="/staff/dashboard"
                  className="flex items-center gap-2 text-primary"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  Overview
                </Link>
                <Link
                  href="/staff/my-attendance"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <User className="h-5 w-5" />
                  My Attendance
                </Link>
                <Link
                  href="/staff/class-attendance"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  Class Attendance
                </Link>
                <Link
                  href="/staff/daily-report"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <BookOpen className="h-5 w-5" />
                  Daily Report
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Link href="/staff/dashboard" className="flex items-center gap-2 font-semibold">
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
              <span className="hidden md:inline-block">{currentUser?.email || "Staff Account"}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Staff Overview</h1>
          <p className="text-muted-foreground">Quick summary for today, {today}. Use the menu to manage details.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff Email</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{currentUser?.email || "Not set"}</div>
              <p className="text-xs text-muted-foreground">Signed in as class teacher</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Class</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{assignedClass?.name || "No class"}</div>
              <p className="text-xs text-muted-foreground">
                {assignedClass ? assignedClass.ageRange : "Set during login"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students in Class</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{classStudents.length}</div>
              <p className="text-xs text-muted-foreground">Students you can mark attendance for</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today Sign-Ins</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{todayStaffAttendance.length}</div>
              <p className="text-xs text-muted-foreground">
                {todayStaffAttendance.length > 0
                  ? "You have signed in for today."
                  : isSignInClosed
                    ? "Sign in closed. You are late for today."
                    : "No sign-in recorded yet for today."}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>My Attendance</CardTitle>
              <CardDescription>Record and review your personal sign-ins.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Sign-ins recorded today: <span className="font-semibold">{todayStaffAttendance.length}</span>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/staff/my-attendance">Open My Attendance</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Class Attendance</CardTitle>
              <CardDescription>Mark and view attendance for your class.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Students in your class: <span className="font-semibold">{classStudents.length}</span>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/staff/class-attendance">Open Class Attendance</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Daily Report</CardTitle>
              <CardDescription>Submit and review your daily class report.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Reports recorded for this class: <span className="font-semibold">{myReports.length}</span>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/staff/daily-report">Open Daily Report</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>Upload and view results for your class.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Use this to create and review student results.
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/staff/results/new">Upload Result</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/staff/results">View All Results</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
