"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useClerk, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { ArrowRight, BarChart3, BookOpen, Check, ChevronDown, GraduationCap, Home, LogOut, Menu, User, Users, X, Banknote } from "lucide-react"

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
import { classesData, pupilsData } from "@/lib/data"

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
const LOAN_REQUESTS_KEY = "staffLoanRequests"

type LoanRequest = {
  id: string
  staffEmail: string
  status: "Pending" | "Approved" | "Rejected"
}

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
  const { signOut } = useClerk()
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  
  // Computed current user state from Clerk
  const currentUser = useMemo(() => {
    if (!user) return null
    return {
      role: (user.publicMetadata.role as string) || "staff",
      email: user.primaryEmailAddress?.emailAddress,
      classId: (user.publicMetadata.classId as string)
    }
  }, [user])

  const [staffAttendance, setStaffAttendance] = useState<StaffAttendanceRecord[]>([])
  const [pupilAttendance, setPupilAttendance] = useState<PupilAttendanceRecord[]>([])
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([])
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([])

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/login?type=staff")
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (typeof window === "undefined") return
    const storedStaff = window.localStorage.getItem(STAFF_ATTENDANCE_KEY)
    const storedPupil = window.localStorage.getItem(PUPIL_ATTENDANCE_KEY)
    const storedReports = window.localStorage.getItem(DAILY_REPORTS_KEY)
    const storedLoan = window.localStorage.getItem(LOAN_REQUESTS_KEY)
    if (storedStaff) {
      try {
        const parsed = JSON.parse(storedStaff) as StaffAttendanceRecord[]
        setStaffAttendance(parsed)
      } catch {
        setStaffAttendance([])
      }
    }
    if (storedPupil) {
      try {
        const parsed = JSON.parse(storedPupil) as PupilAttendanceRecord[]
        setPupilAttendance(parsed)
      } catch {
        setPupilAttendance([])
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
    if (storedLoan) {
      try {
        const parsed = JSON.parse(storedLoan) as LoanRequest[]
        setLoanRequests(parsed)
      } catch {
        setLoanRequests([])
      }
    }
  }, [])

  const assignedClass = useMemo(
    () => classesData.find((cls) => cls.id === currentUser?.classId),
    [currentUser?.classId],
  )

  const classPupils = useMemo(() => {
    if (!assignedClass) return []
    return pupilsData.filter((pupil) => pupil.class === assignedClass.name)
  }, [assignedClass])

  const [today, setToday] = useState("")
  const [isSignInClosed, setIsSignInClosed] = useState(false)
  const [dashboardData, setDashboardData] = useState({
    attendanceMarked: false,
    pupilCount: 0,
    pendingLoans: 0,
    recentReports: [] as DailyReport[]
  })

  useEffect(() => {
    setToday(formatDate(new Date()))
    setIsSignInClosed(isAfterSignInCutoff())
  }, [])

  useEffect(() => {
    if (currentUser?.email) {
      fetchDashboardData()
    }
  }, [currentUser])

  const fetchDashboardData = async () => {
    try {
      const query = new URLSearchParams({
        email: currentUser?.email || "",
        classId: currentUser?.classId || ""
      })
      const res = await fetch(`/api/staff/dashboard?${query}`)
      if (res.ok) {
        const data = await res.json()
        setDashboardData(data)
      }
    } catch (e) {
      console.error("Failed to fetch dashboard data", e)
    }
  }

  // Use API data where applicable, fallback to local logic if needed
  const attendanceMarked = dashboardData.attendanceMarked
  const pupilCount = dashboardData.pupilCount
  const pendingLoanCount = dashboardData.pendingLoans
  const myReports = dashboardData.recentReports.map((r: any) => {
      const content = typeof r.content === 'string' ? JSON.parse(r.content) : r.content
      return {
          ...r,
          topicsTaught: content.topicsTaught,
          incidentReport: content.incidentReport,
          homework: content.homework,
          generalComment: content.generalComment,
          staffEmail: r.submittedBy // Mapping
      }
  })

  // Keep these for now if used elsewhere in UI, but primary metrics come from API
  const todayStaffAttendance = useMemo(() => {
    if (!currentUser || !today) return []
    return staffAttendance.filter((record) => record.staffEmail === currentUser.email && record.date === today)
  }, [currentUser, staffAttendance, today])

  const handleLogout = () => { signOut(() => { router.push("/login") }) }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
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
                <Link
                  href="/staff/loan"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Banknote className="h-5 w-5" />
                  Loan Request
                </Link>
                <Link
                  href="/staff/pupils"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  My Pupils
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
            <Link href="/staff/loan">
              <DropdownMenuItem>
                <Banknote className="mr-2 h-4 w-4" />
                <span>Loan Request</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/staff/pupils">
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                <span>My Pupils</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex flex-1 flex-col gap-8 p-4 md:gap-12 md:p-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Staff Overview</h1>
          <p className="text-muted-foreground">Quick summary for today, {today}. Use the menu to manage details.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-t-4 border-t-blue-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Staff Email
              </CardTitle>
              <div className="rounded-full bg-blue-50 p-1">
                <span className="text-blue-500 text-xs font-bold px-1">@</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-slate-800">{currentUser?.email || "Not set"}</div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Signed in as class teacher</p>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-green-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Assigned Class
              </CardTitle>
              <div className="rounded-full bg-green-50 p-1">
                <GraduationCap className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-slate-800">{assignedClass?.name || "No class"}</div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                Age group: {assignedClass ? assignedClass.ageRange : "Set during login"}
              </p>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-orange-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pupils in Class
              </CardTitle>
              <div className="rounded-full bg-orange-50 p-1">
                <Users className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-slate-800">{classPupils.length}</div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Active attendance track</p>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-red-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Today Sign-Ins
              </CardTitle>
              <div className="rounded-full bg-red-50 p-1">
                <BarChart3 className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-slate-800">{todayStaffAttendance.length}</div>
              <p className="text-xs text-red-500 mt-1 font-semibold">
                {todayStaffAttendance.length > 0
                  ? "You have signed in for today."
                  : isSignInClosed
                    ? "Late for today"
                    : "No sign-in recorded yet."}
              </p>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-purple-500 shadow-sm relative group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Loan Status
              </CardTitle>
              <div className="rounded-full bg-purple-50 p-1">
                <Banknote className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-slate-800">{pendingLoanCount}</div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Pending Requests</p>
            </CardContent>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
               <Button size="sm" variant="secondary" asChild className="shadow-sm">
                 <Link href="/staff/loan">Manage Loans</Link>
               </Button>
            </div>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="relative p-6 pt-10 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-6 left-6 rounded-full bg-blue-100 p-3">
              <User className="h-6 w-6 text-blue-500" />
            </div>
            <div className="absolute top-10 right-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
              {todayStaffAttendance.length}
            </div>
            <CardHeader className="px-0 pt-8">
              <CardTitle className="text-2xl font-bold text-slate-800">My Attendance</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-8">
              <p className="text-slate-500 font-medium leading-relaxed">
                Record and review your personal sign-ins. Keep track of your working hours and punctualities.
              </p>
            </CardContent>
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-semibold text-slate-700">Sign-ins recorded today</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                  {todayStaffAttendance.length}
                </span>
              </div>
              <Button asChild className="w-full bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold h-12 rounded-xl border-none">
                <Link href="/staff/my-attendance" className="flex items-center justify-center gap-2">
                  Open My Attendance <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </Card>

          <Card className="relative p-6 pt-10 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-6 left-6 rounded-full bg-green-100 p-3">
              <Users className="h-6 w-6 text-green-500" />
            </div>
            <div className="absolute top-10 right-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
              {classPupils.length}
            </div>
            <CardHeader className="px-0 pt-8">
              <CardTitle className="text-2xl font-bold text-slate-800">Class Attendance</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-8">
              <p className="text-slate-500 font-medium leading-relaxed">
                Mark and view attendance for your class. Ensure all pupils are accounted for daily.
              </p>
            </CardContent>
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-semibold text-slate-700">Pupils in your class</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                  {classPupils.length}
                </span>
              </div>
              <Button asChild className="w-full bg-green-500 hover:bg-green-600 text-white font-bold h-12 rounded-xl border-none">
                <Link href="/staff/class-attendance" className="flex items-center justify-center gap-2">
                  Open Class Attendance <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </Card>

          <Card className="relative p-6 pt-10 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-6 left-6 rounded-full bg-amber-100 p-3">
              <BookOpen className="h-6 w-6 text-amber-600" />
            </div>
            <div className="absolute top-10 right-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
              {myReports.length}
            </div>
            <CardHeader className="px-0 pt-8">
              <CardTitle className="text-2xl font-bold text-slate-800">Daily Report</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-8">
              <p className="text-slate-500 font-medium leading-relaxed">
                Submit and review your daily class report including milestones and specific activities.
              </p>
            </CardContent>
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-semibold text-slate-700">Reports recorded for this class</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                  {myReports.length}
                </span>
              </div>
              <Button asChild className="w-full bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold h-12 rounded-xl border-none">
                <Link href="/staff/daily-report" className="flex items-center justify-center gap-2">
                  Open Daily Report <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </Card>

          <Card className="relative p-6 pt-10 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-6 left-6 rounded-full bg-purple-100 p-3">
              <GraduationCap className="h-6 w-6 text-purple-600" />
            </div>
            <div className="absolute top-10 right-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
              0
            </div>
            <CardHeader className="px-0 pt-8">
              <CardTitle className="text-2xl font-bold text-slate-800">Results</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-8">
              <p className="text-slate-500 font-medium leading-relaxed">
                Upload and view academic results for your class. Track progress and performance metrics.
              </p>
            </CardContent>
            <div className="pt-4 border-t border-slate-100">
              <div className="flex gap-4 mt-2">
                <Button asChild className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold h-12 rounded-xl border-none">
                  <Link href="/staff/results/new" className="flex items-center justify-center gap-2">
                    <LogOut className="h-4 w-4 rotate-90" /> Upload Result
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 border-slate-200 text-slate-600 font-bold h-12 rounded-xl">
                  <Link href="/staff/results" className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4" /> View All
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          <Card className="relative p-6 pt-10 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-6 left-6 rounded-full bg-orange-100 p-3">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div className="absolute top-10 right-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
              {classPupils.length}
            </div>
            <CardHeader className="px-0 pt-8">
              <CardTitle className="text-2xl font-bold text-slate-800">Pupils</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-8">
              <p className="text-slate-500 font-medium leading-relaxed">
                View detailed profiles of pupils in your class. Access contact info and history.
              </p>
            </CardContent>
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-semibold text-slate-700">Total pupils enrolled</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                  {classPupils.length}
                </span>
              </div>
              <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 rounded-xl border-none">
                <Link href="/staff/pupils" className="flex items-center justify-center gap-2">
                  View Pupils <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
