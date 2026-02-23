"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronDown,
  FileText,
  Home,
  LogOut,
  Menu,
  PieChart,
  Plus,
  Settings,
  User,
  Users,
} from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { studentsData } from "../students/page"
import { classesData } from "../classes/page"
import { resultsData, type ResultRecord } from "../results/page"

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

const RESULTS_STORAGE_KEY = "adminResults"
const STUDENT_ATTENDANCE_KEY = "studentAttendance"
const DAILY_REPORTS_KEY = "dailyReports"

const loadResultsFromStorage = (): ResultRecord[] => {
  if (typeof window === "undefined") return resultsData
  const stored = window.localStorage.getItem(RESULTS_STORAGE_KEY)
  if (!stored) {
    window.localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(resultsData))
    return resultsData
  }
  try {
    const parsed = JSON.parse(stored) as ResultRecord[]
    if (!Array.isArray(parsed)) {
      return resultsData
    }
    return parsed
  } catch {
    return resultsData
  }
}

const loadStudentAttendanceFromStorage = (): StudentAttendanceRecord[] => {
  if (typeof window === "undefined") return []
  const stored = window.localStorage.getItem(STUDENT_ATTENDANCE_KEY)
  if (!stored) return []
  try {
    const parsed = JSON.parse(stored) as StudentAttendanceRecord[]
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed
  } catch {
    return []
  }
}

const loadDailyReportsFromStorage = (): DailyReport[] => {
  if (typeof window === "undefined") return []
  const stored = window.localStorage.getItem(DAILY_REPORTS_KEY)
  if (!stored) return []
  try {
    const parsed = JSON.parse(stored) as DailyReport[]
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed
  } catch {
    return []
  }
}

export default function AdminDashboard() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const [results] = useState<ResultRecord[]>(() => loadResultsFromStorage())
  const [studentAttendance] = useState<StudentAttendanceRecord[]>(() => loadStudentAttendanceFromStorage())
  const [dailyReports] = useState<DailyReport[]>(() => loadDailyReportsFromStorage())

  const totalStudents = studentsData.length
  const totalClasses = classesData.length

  const publishedResults = useMemo(
    () => results.filter((result) => result.status === "Published"),
    [results],
  )

  const totalPublishedResults = publishedResults.length
  const totalDraftResults = results.length - totalPublishedResults

  const averageScore =
    publishedResults.length > 0
      ? publishedResults.reduce((sum, result) => sum + result.averageScore, 0) / publishedResults.length
      : 0

  const gradeAnalytics = useMemo(() => {
    const grades = ["A", "B", "C", "D", "F"] as const
    const counts: Record<(typeof grades)[number], number> = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      F: 0,
    }

    publishedResults.forEach((result) => {
      if (result.grade && grades.includes(result.grade as (typeof grades)[number])) {
        counts[result.grade as (typeof grades)[number]] += 1
      }
    })

    const total = grades.reduce((sum, grade) => sum + counts[grade], 0)
    const achievedAB = counts.A + counts.B
    const achievedABPercent = total > 0 ? Math.round(((achievedAB / total) * 100 + Number.EPSILON) * 10) / 10 : 0

    return {
      counts,
      total,
      achievedABPercent,
      breakdown: grades.map((grade) => ({
        grade,
        count: counts[grade],
        percent: total > 0 ? Math.round(((counts[grade] / total) * 100 + Number.EPSILON) * 10) / 10 : 0,
      })),
    }
  }, [publishedResults])

  const classAnalytics = useMemo(() => {
    const map = new Map<
      string,
      {
        totalScore: number
        count: number
      }
    >()

    publishedResults.forEach((result) => {
      const key = result.class
      const current = map.get(key) ?? { totalScore: 0, count: 0 }
      map.set(key, {
        totalScore: current.totalScore + result.averageScore,
        count: current.count + 1,
      })
    })

    const entries = Array.from(map.entries()).map(([className, value]) => ({
      className,
      count: value.count,
      average: value.count > 0 ? value.totalScore / value.count : 0,
    }))

    entries.sort((a, b) => (a.average < b.average ? 1 : -1))

    return entries
  }, [publishedResults])

  const termOrder: Record<string, number> = {
    "Term 1": 1,
    "Term 2": 2,
    "Term 3": 3,
  }

  const termAnalytics = useMemo(() => {
    const map = new Map<
      string,
      {
        totalScore: number
        count: number
      }
    >()

    publishedResults.forEach((result) => {
      const key = result.term
      const current = map.get(key) ?? { totalScore: 0, count: 0 }
      map.set(key, {
        totalScore: current.totalScore + result.averageScore,
        count: current.count + 1,
      })
    })

    const entries = Array.from(map.entries()).map(([term, value]) => ({
      term,
      count: value.count,
      average: value.count > 0 ? value.totalScore / value.count : 0,
    }))

    entries.sort((a, b) => {
      const orderA = termOrder[a.term] ?? 99
      const orderB = termOrder[b.term] ?? 99
      if (orderA === orderB) {
        return a.term.localeCompare(b.term)
      }
      return orderA - orderB
    })

    return entries
  }, [publishedResults])

  const statusAnalytics = useMemo(() => {
    const map = new Map<
      string,
      {
        count: number
      }
    >()

    results.forEach((result) => {
      const key = result.status || "Unknown"
      const current = map.get(key) ?? { count: 0 }
      map.set(key, {
        count: current.count + 1,
      })
    })

    const entries = Array.from(map.entries()).map(([status, value]) => ({
      status,
      count: value.count,
    }))

    const total = entries.reduce((sum, entry) => sum + entry.count, 0)

    const withPercent = entries.map((entry) => ({
      ...entry,
      percent: total > 0 ? Math.round(((entry.count / total) * 100 + Number.EPSILON) * 10) / 10 : 0,
    }))

    withPercent.sort((a, b) => b.count - a.count)

    return {
      total,
      breakdown: withPercent,
    }
  }, [results])

  const attendanceAnalytics = useMemo(() => {
    if (studentAttendance.length === 0) {
      return {
        overallPercent: 0,
        totalRecords: 0,
        uniqueStudents: 0,
        atRiskCount: 0,
      }
    }

    const byStudent = new Map<string, Map<string, StudentAttendanceRecord["status"]>>()

    studentAttendance.forEach((record) => {
      let dates = byStudent.get(record.studentId)
      if (!dates) {
        dates = new Map()
        byStudent.set(record.studentId, dates)
      }
      dates.set(record.date, record.status)
    })

    let totalDays = 0
    let totalPresentDays = 0
    let atRiskCount = 0

    byStudent.forEach((dates) => {
      const days = dates.size
      if (days === 0) return
      let presentDays = 0
      dates.forEach((status) => {
        if (status === "Absent") return
        presentDays += 1
      })
      totalDays += days
      totalPresentDays += presentDays
      const percent = (presentDays / days) * 100
      if (percent < 75) {
        atRiskCount += 1
      }
    })

    const overallPercent =
      totalDays > 0 ? Math.round(((totalPresentDays / totalDays) * 100 + Number.EPSILON) * 10) / 10 : 0

    return {
      overallPercent,
      totalRecords: studentAttendance.length,
      uniqueStudents: byStudent.size,
      atRiskCount,
    }
  }, [studentAttendance])

  const reportsAnalytics = useMemo(
    () => ({
      totalReports: dailyReports.length,
    }),
    [dailyReports],
  )

  const recentResults = useMemo(
    () =>
      [...results]
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(0, 3),
    [results],
  )

  const sortedReports = useMemo(
    () => [...results].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [results],
  )

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
                href="/admin/dashboard"
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
                <span className="sr-only">Bayhood Preparatory School</span>
              </Link>
              <div className="grid gap-3">
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2 text-primary"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/admin/results"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <FileText className="h-5 w-5" />
                  Results
                </Link>
                <Link
                  href="/admin/students"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  Students
                </Link>
                <Link
                  href="/admin/classes"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <BookOpen className="h-5 w-5" />
                  Classes
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
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
              <span className="hidden md:inline-block">Admin User</span>
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
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href="/">
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <div className="grid flex-1 md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r bg-muted/40 md:block">
          <nav className="grid gap-2 p-4 text-sm">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/results"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <FileText className="h-4 w-4" />
              Results
            </Link>
              <Link
                href="/admin/attendance"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              >
                <Calendar className="h-4 w-4" />
                Attendance
              </Link>
            <Link
              href="/admin/students"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Users className="h-4 w-4" />
              Students
            </Link>
            <Link
              href="/admin/classes"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <BookOpen className="h-4 w-4" />
              Classes
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </aside>
        <main className="flex flex-col gap-6 p-4 md:gap-8 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div className="grid gap-1">
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome to the admin dashboard. Manage results, students, and classes.
              </p>
            </div>
            <div className="flex-1" />
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalStudents}</div>
                    <p className="text-xs text-muted-foreground">Across all active classes</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Classes</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalClasses}</div>
                    <p className="text-xs text-muted-foreground">Creche, Playgroup, Preschool, Nursery</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Results Published</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalPublishedResults}</div>
                    <p className="text-xs text-muted-foreground">
                      {totalDraftResults} pending review
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {reportsAnalytics.totalReports} daily reports recorded
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">
                      Across published results; average attendance {attendanceAnalytics.overallPercent.toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Results</CardTitle>
                    <CardDescription>The latest results uploaded to the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {recentResults.map((result) => (
                        <div key={result.id} className="space-y-2">
                          <div className="flex items-center">
                            <div className="font-medium">
                              {result.class} - {result.term} - {result.studentName}
                            </div>
                            <div className="ml-auto text-sm text-muted-foreground">{result.date}</div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ID {result.studentId}, average score {result.averageScore}% ({result.grade || "No grade"})
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${Math.min(Math.max(result.averageScore, 0), 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Performance Distribution</CardTitle>
                    <CardDescription>Grade distribution across all classes</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="flex aspect-square items-center justify-center">
                      <div className="flex h-40 w-40 items-center justify-center rounded-full border-8 border-primary text-center">
                        <div className="space-y-1">
                          <PieChart className="h-6 w-6 mx-auto text-muted-foreground" />
                          <div className="text-xl font-bold">72%</div>
                          <div className="text-xs text-muted-foreground">Achieved A or B</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <div>A Grade (35%)</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <div>B Grade (37%)</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <div>C Grade (20%)</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <div>D & F Grade (8%)</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Grade Analytics</CardTitle>
                    <CardDescription>Distribution of grades across published results.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {gradeAnalytics.total === 0 ? (
                      <div className="flex h-[220px] items-center justify-center rounded-md border border-dashed">
                        <div className="flex flex-col items-center gap-1 text-center">
                          <PieChart className="h-8 w-8 text-muted-foreground" />
                          <h3 className="text-lg font-semibold">No grade data yet</h3>
                          <p className="text-sm text-muted-foreground">
                            Publish some results to see grade analytics.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-primary text-center">
                            <div className="space-y-1">
                              <PieChart className="h-5 w-5 mx-auto text-muted-foreground" />
                              <div className="text-lg font-bold">{gradeAnalytics.achievedABPercent}%</div>
                              <div className="text-xs text-muted-foreground">A or B grades</div>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {gradeAnalytics.breakdown.map((item) => (
                            <div key={item.grade} className="flex items-center justify-between">
                              <span className="font-medium">{item.grade}</span>
                              <span className="text-muted-foreground">
                                {item.count} ({item.percent}%)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Class Performance</CardTitle>
                    <CardDescription>Average scores by class (published results only).</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {classAnalytics.length === 0 ? (
                      <div className="flex h-[220px] items-center justify-center rounded-md border border-dashed">
                        <div className="flex flex-col items-center gap-1 text-center">
                          <BarChart3 className="h-8 w-8 text-muted-foreground" />
                          <h3 className="text-lg font-semibold">No class data yet</h3>
                          <p className="text-sm text-muted-foreground">
                            Publish some results to compare class performance.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="max-h-[260px] overflow-auto rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Class</TableHead>
                                <TableHead>Students</TableHead>
                                <TableHead>Average</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {classAnalytics.map((item) => (
                                <TableRow key={item.className}>
                                  <TableCell className="font-medium">{item.className}</TableCell>
                                  <TableCell>{item.count}</TableCell>
                                  <TableCell>{item.average.toFixed(1)}%</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Term Performance</CardTitle>
                    <CardDescription>Average scores by term (published results only).</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {termAnalytics.length === 0 ? (
                      <div className="flex h-[220px] items-center justify-center rounded-md border border-dashed">
                        <div className="flex flex-col items-center gap-1 text-center">
                          <BarChart3 className="h-8 w-8 text-muted-foreground" />
                          <h3 className="text-lg font-semibold">No term data yet</h3>
                          <p className="text-sm text-muted-foreground">
                            Publish some results for different terms to compare.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="max-h-[260px] overflow-auto rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Term</TableHead>
                                <TableHead>Students</TableHead>
                                <TableHead>Average</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {termAnalytics.map((item) => (
                                <TableRow key={item.term}>
                                  <TableCell className="font-medium">{item.term}</TableCell>
                                  <TableCell>{item.count}</TableCell>
                                  <TableCell>{item.average.toFixed(1)}%</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Status Overview</CardTitle>
                    <CardDescription>Distribution of result statuses.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {statusAnalytics.total === 0 ? (
                      <div className="flex h-[220px] items-center justify-center rounded-md border border-dashed">
                        <div className="flex flex-col items-center gap-1 text-center">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <h3 className="text-lg font-semibold">No results yet</h3>
                          <p className="text-sm text-muted-foreground">
                            Create some results to see status analytics.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-sm text-muted-foreground">
                          {statusAnalytics.total} total results across all statuses.
                        </div>
                        <div className="space-y-2 text-sm">
                          {statusAnalytics.breakdown.map((item) => (
                            <div key={item.status} className="flex items-center justify-between">
                              <span className="font-medium">{item.status}</span>
                              <span className="text-muted-foreground">
                                {item.count} ({item.percent}%)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance & Reports</CardTitle>
                    <CardDescription>Summary of attendance and daily reports.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Average attendance</span>
                        <span className="font-medium">
                          {attendanceAnalytics.overallPercent.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>At-risk students</span>
                        <span className="font-medium">{attendanceAnalytics.atRiskCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Daily reports recorded</span>
                        <span className="font-medium">{reportsAnalytics.totalReports}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>Generate and view reports for different classes and terms.</CardDescription>
                </CardHeader>
                <CardContent>
                  {sortedReports.length === 0 ? (
                    <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">No reports yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Create a result to see it listed here as a report.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{sortedReports.length} reports generated</span>
                        <Link href="/admin/results" className="underline">
                          View in Results
                        </Link>
                      </div>
                      <div className="max-h-[360px] overflow-auto rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Report ID</TableHead>
                              <TableHead>Student</TableHead>
                              <TableHead className="hidden md:table-cell">Class</TableHead>
                              <TableHead>Term</TableHead>
                              <TableHead className="hidden md:table-cell">Average</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="hidden md:table-cell">Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sortedReports.map((result) => (
                              <TableRow key={result.id}>
                                <TableCell className="font-medium">{result.id}</TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span>{result.studentName}</span>
                                    <span className="text-xs text-muted-foreground">{result.studentId}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{result.class}</TableCell>
                                <TableCell>{result.term}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {result.averageScore.toFixed(1)}% {result.grade && `(${result.grade})`}
                                </TableCell>
                                <TableCell>{result.status}</TableCell>
                                <TableCell className="hidden md:table-cell">{result.date}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
