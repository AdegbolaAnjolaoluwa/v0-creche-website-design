"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, ChevronDown, Home, LogOut, Menu, User, Users } from "lucide-react"

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

type StaffAttendanceRecord = {
  id: string
  staffEmail: string
  date: string
  time: string
  createdAt: string
}

type CurrentUser = {
  role: string
  email?: string
  classId?: string
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

const DAILY_REPORTS_KEY = "dailyReports"
const STAFF_ATTENDANCE_KEY = "staffAttendance"

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function isAfterSignInCutoff() {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  if (hours > 7) return true
  if (hours < 7) return false
  return minutes >= 45
}

export default function DailyReportPage() {
  const router = useRouter()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([])
  const [reportTopicsTaught, setReportTopicsTaught] = useState("")
  const [reportActivitiesDone, setReportActivitiesDone] = useState("")
  const [reportBehaviourNotes, setReportBehaviourNotes] = useState("")
  const [reportHomework, setReportHomework] = useState("")
  const [reportGeneralComment, setReportGeneralComment] = useState("")
  const [isSavingReport, setIsSavingReport] = useState(false)
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendanceRecord[]>([])

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
    const storedReports = window.localStorage.getItem(DAILY_REPORTS_KEY)
    const storedStaff = window.localStorage.getItem(STAFF_ATTENDANCE_KEY)
    if (storedReports) {
      try {
        const parsed = JSON.parse(storedReports) as DailyReport[]
        setDailyReports(parsed)
      } catch {
        setDailyReports([])
      }
    }
    if (storedStaff) {
      try {
        const parsedStaff = JSON.parse(storedStaff) as StaffAttendanceRecord[]
        setStaffAttendance(parsedStaff)
      } catch {
        setStaffAttendance([])
      }
    }
  }, [])

  const assignedClass = useMemo(
    () => classesData.find((cls) => cls.id === currentUser?.classId),
    [currentUser?.classId],
  )

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

  const todayStaffAttendance = useMemo(() => {
    if (!currentUser) return []
    return staffAttendance.filter((record) => record.staffEmail === currentUser.email && record.date === today)
  }, [currentUser, staffAttendance, today])

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
    return reports.slice(0, 20)
  }, [currentUser, dailyReports])

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
                  className="flex items-center gap-2"
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
                  className="flex items-center gap-2 text-primary"
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
          <h1 className="text-2xl font-bold tracking-tight">Daily Report</h1>
          <p className="text-muted-foreground">
            Submit and review your daily report for your class. Today is {today}.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
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
              <CardTitle className="text-sm font-medium">Reports Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{myReports.length}</div>
              <p className="text-xs text-muted-foreground">Latest reports for this class.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today&apos;s Sign-In</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{todayStaffAttendance.length}</div>
              <p className="text-xs text-muted-foreground">
                {todayStaffAttendance.length > 0
                  ? "You have signed in for today."
                  : isSignInClosed
                    ? "Sign in closed. You are late for today."
                    : "No personal sign-in recorded yet for today."}
              </p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Report</CardTitle>
            <CardDescription>Submit or update your report for today.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="topics-taught">
                Topics taught
              </label>
              <textarea
                id="topics-taught"
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={reportTopicsTaught}
                onChange={(e) => setReportTopicsTaught(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="activities-done">
                Class activities
              </label>
              <textarea
                id="activities-done"
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={reportActivitiesDone}
                onChange={(e) => setReportActivitiesDone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="behaviour-notes">
                Behaviour notes
              </label>
              <textarea
                id="behaviour-notes"
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={reportBehaviourNotes}
                onChange={(e) => setReportBehaviourNotes(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="homework">
                Homework given
              </label>
              <textarea
                id="homework"
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={reportHomework}
                onChange={(e) => setReportHomework(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="general-comment">
                General comment
              </label>
              <textarea
                id="general-comment"
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={reportGeneralComment}
                onChange={(e) => setReportGeneralComment(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button type="button" onClick={handleSaveReport} disabled={isSavingReport}>
                {isSavingReport ? "Saving..." : todaysReport ? "Update Today’s Report" : "Submit Today’s Report"}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>My Recent Reports</CardTitle>
            <CardDescription>View the latest daily reports you have submitted for this class.</CardDescription>
          </CardHeader>
          <CardContent>
            {myReports.length === 0 ? (
              <div className="text-sm text-muted-foreground">No reports submitted yet.</div>
            ) : (
              <div className="max-h-[320px] overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Topics taught</TableHead>
                      <TableHead className="hidden md:table-cell">Activities</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.date}</TableCell>
                        <TableCell className="max-w-[260px] truncate">{report.topicsTaught}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-[260px] truncate">
                          {report.activitiesDone}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
