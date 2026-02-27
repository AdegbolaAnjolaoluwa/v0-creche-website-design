"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, CheckCircle2, ChevronDown, Clock, Home, LogOut, Menu, User, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
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
import { classesData } from "@/lib/data"

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
  incidentReport: string
  homework: string
  generalComment: string
  createdAt: string
  approvalStatus?: "Pending" | "Approved"
  approvedBy?: string
  approvedAt?: string
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
  const { signOut } = useClerk();
  const router = useRouter()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([])
  const [reportTopicsTaught, setReportTopicsTaught] = useState("")
  const [reportIncidentReport, setReportIncidentReport] = useState("")
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
      setReportIncidentReport("")
      setReportHomework("")
      setReportGeneralComment("")
      return
    }
    setReportTopicsTaught(todaysReport.topicsTaught)
    setReportIncidentReport(todaysReport.incidentReport)
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
      incidentReport: reportIncidentReport,
      homework: reportHomework,
      generalComment: reportGeneralComment,
      createdAt,
      approvalStatus: "Pending",
    }
    let updated: DailyReport[]
    if (existingIndex >= 0) {
      updated = dailyReports.slice()
      // Keep existing approval if it was already approved
      const existing = updated[existingIndex]
      updated[existingIndex] = {
        ...existing,
        topicsTaught: baseReport.topicsTaught,
        incidentReport: baseReport.incidentReport,
        homework: baseReport.homework,
        generalComment: baseReport.generalComment,
        // Reset to pending if edited, unless already approved?
        // Let's reset to pending if edited
        approvalStatus: "Pending",
      }
    } else {
      updated = [...dailyReports, baseReport]
    }
    setDailyReports(updated)
    window.localStorage.setItem(DAILY_REPORTS_KEY, JSON.stringify(updated))
    setIsSavingReport(false)
  }

  const handleLogout = () => { signOut(() => { router.push("/login") }) }

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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/staff/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Daily Report</h1>
          </div>
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Today&apos;s Report</CardTitle>
                <CardDescription>Submit or update your report for today.</CardDescription>
              </div>
              {todaysReport?.approvalStatus === "Approved" && (
                <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 border-none gap-1 py-1 px-3">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Signed Off by Admin
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaysReport?.approvalStatus === "Approved" && (
              <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800 border border-green-200 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                This report has been approved and signed off. Any further changes will reset the status to pending.
              </div>
            )}
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
              <label className="block text-sm font-medium mb-1" htmlFor="incident-report">
                Incident report
              </label>
              <textarea
                id="incident-report"
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={reportIncidentReport}
                onChange={(e) => setReportIncidentReport(e.target.value)}
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
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.date}</TableCell>
                        <TableCell className="max-w-[260px] truncate">{report.topicsTaught}</TableCell>
                        <TableCell>
                          {report.approvalStatus === "Approved" ? (
                            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 border-none h-6 px-2">
                              Approved
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-none h-6 px-2">
                              Pending
                            </Badge>
                          )}
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
