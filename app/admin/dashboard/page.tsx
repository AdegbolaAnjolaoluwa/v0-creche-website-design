"use client"

import { useMemo, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Protect, SignOutButton } from "@clerk/nextjs"
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

import { pupilsData, classesData, resultsData, type ResultRecord } from "@/lib/data"

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
  incidentReport: string
  homework: string
  generalComment: string
  createdAt: string
  approvalStatus?: "Pending" | "Approved"
  approvedBy?: string
  approvedAt?: string
}

const RESULTS_STORAGE_KEY = "adminResults"
const PUPIL_ATTENDANCE_KEY = "pupilAttendance"
const DAILY_REPORTS_KEY = "dailyReports"
const LOAN_REQUESTS_KEY = "staffLoanRequests"

type LoanRequest = {
  id: string
  staffEmail: string
  amount: number
  repaymentPlan: string
  reason: string
  status: "Pending" | "Approved" | "Rejected"
  createdAt: string
  adminComment?: string
}

const loadResultsFromStorage = (): ResultRecord[] => {
  return resultsData
}

const loadPupilAttendanceFromStorage = (): PupilAttendanceRecord[] => {
  return []
}

const loadDailyReportsFromStorage = (): DailyReport[] => {
  return []
}

const loadLoanRequestsFromStorage = (): LoanRequest[] => {
  return []
}

export default function AdminDashboard() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalPupils: 0,
    totalClasses: 0,
    totalResults: 0,
    totalPublishedResults: 0,
    totalDraftResults: 0,
    averageScore: 0,
    todaysAttendance: 0
  });

  const [chartsData, setChartsData] = useState<{
    gradeDistribution: { grade: string, count: number }[],
    classPerformance: { className: string, averageScore: number }[],
    termPerformance: { term: string, averageScore: number }[],
    attendanceStats: { status: string, count: number }[],
    loanStats: { status: string, count: number }[],
    totalReports: number
  }>({
    gradeDistribution: [],
    classPerformance: [],
    termPerformance: [],
    attendanceStats: [],
    loanStats: [],
    totalReports: 0
  });

  const [recentActivity, setRecentActivity] = useState<ResultRecord[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          const data = await res.json();
          setDashboardMetrics(data.metrics);
          setChartsData(data.charts);
          
          // Map API response to ResultRecord type
          const mappedRecent = data.recentActivity.map((r: any) => ({
            id: r.id,
            studentName: r.studentName,
            class: r.class || "Unknown",
            term: r.term,
            averageScore: r.averageScore,
            status: r.status,
            date: new Date(r.createdAt).toISOString().split('T')[0],
            // Fill default values for fields not returned by this specific API query
            studentId: "",
            academicYear: "",
            subjects: [],
            totalScore: 0,
            position: "",
            teacherComment: "",
            headTeacherComment: ""
          }));
          setRecentActivity(mappedRecent);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard metrics", error);
      }
    };
    fetchMetrics();
  }, []);

  const totalPupils = dashboardMetrics.totalPupils;
  const totalClasses = dashboardMetrics.totalClasses;
  const totalResults = dashboardMetrics.totalResults;
  const attendanceToday = dashboardMetrics.todaysAttendance;
  
  // Metrics from API
  const totalPublishedResults = dashboardMetrics.totalPublishedResults;
  const totalDraftResults = dashboardMetrics.totalDraftResults;
  const averageScore = dashboardMetrics.averageScore;

  // Keep existing detailed logic for charts (can be migrated later if needed)
  const results = useMemo<ResultRecord[]>(() => [], [])
  const pupilAttendance = useMemo<PupilAttendanceRecord[]>(() => [], [])
  const dailyReports = useMemo<DailyReport[]>(() => [], [])
  const loanRequests = useMemo<LoanRequest[]>(() => [], [])

  const publishedResults = useMemo<ResultRecord[]>(
    () => [],
    [],
  )

  // const recentResults = useMemo<ResultRecord[]>(
  //   () => [],
  //   []
  // )

  const recentResults = recentActivity;

  const gradeAnalytics = useMemo(() => {
    const grades = ["A", "B", "C", "D", "F"] as const
    const counts: Record<(typeof grades)[number], number> = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      F: 0,
    }

    if (chartsData?.gradeDistribution) {
      chartsData.gradeDistribution.forEach((item) => {
        if (grades.includes(item.grade as any)) {
          counts[item.grade as (typeof grades)[number]] = item.count
        }
      })
    }

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
  }, [chartsData])

  const classAnalytics = useMemo(() => {
    if (!chartsData?.classPerformance) return [];
    
    return chartsData.classPerformance.map((item) => ({
      className: item.className,
      count: 1, // API returns aggregated, so count is technically 1 per row, but avg is pre-calculated
      average: item.averageScore,
    })).sort((a, b) => (a.average < b.average ? 1 : -1))
  }, [chartsData])

  const termOrder: Record<string, number> = {
    "Term 1": 1,
    "Term 2": 2,
    "Term 3": 3,
  }

  const termAnalytics = useMemo(() => {
    if (!chartsData?.termPerformance) return [];

    return chartsData.termPerformance.map((item) => ({
      term: item.term,
      count: 1,
      average: item.averageScore,
    })).sort((a, b) => {
      const orderA = termOrder[a.term] ?? 99
      const orderB = termOrder[b.term] ?? 99
      if (orderA === orderB) {
        return a.term.localeCompare(b.term)
      }
      return orderA - orderB
    })
  }, [chartsData])

  const statusAnalytics = useMemo(() => {
    // We already have these from metrics
    const total = totalPublishedResults + totalDraftResults;
    const entries = [
      { status: "Published", count: totalPublishedResults },
      { status: "Draft", count: totalDraftResults }
    ];

    const withPercent = entries.map((entry) => ({
      ...entry,
      percent: total > 0 ? Math.round(((entry.count / total) * 100 + Number.EPSILON) * 10) / 10 : 0,
    }))

    return {
      total,
      breakdown: withPercent,
    }
  }, [totalPublishedResults, totalDraftResults])

  const attendanceAnalytics = useMemo(() => {
    if (!chartsData?.attendanceStats) return {
      overallPercent: 0,
      totalRecords: 0,
      uniquePupils: 0,
      atRiskCount: 0,
    };

    let totalRecords = 0;
    let presentCount = 0;

    chartsData.attendanceStats.forEach(stat => {
      totalRecords += stat.count;
      if (stat.status === "Present" || stat.status === "Late") {
        presentCount += stat.count;
      }
    });

    const overallPercent = totalRecords > 0 
      ? Math.round(((presentCount / totalRecords) * 100 + Number.EPSILON) * 10) / 10 
      : 0;

    return {
      overallPercent,
      totalRecords,
      uniquePupils: 0, // Not available in simple aggregation yet
      atRiskCount: 0, // Not available in simple aggregation yet
    }
  }, [chartsData])

  const reportsAnalytics = useMemo(
    () => ({
      totalReports: chartsData?.totalReports || 0,
    }),
    [chartsData],
  )
  
  const loanAnalytics = useMemo(() => {
    let pending = 0;
    let total = 0;
    
    if (chartsData?.loanStats) {
      chartsData.loanStats.forEach(stat => {
        total += stat.count;
        if (stat.status === "Pending") pending += stat.count;
      });
    }

    return {
      pending,
      total
    }
  }, [chartsData])

  // Removed duplicate recentResults declaration here as it is now handled by API data above

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
                  href="/admin/attendance"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Calendar className="h-5 w-5" />
                  Attendance
                </Link>
                <Link
                  href="/admin/daily-reports"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <FileText className="h-5 w-5" />
                  Daily Reports
                </Link>
                <Link
                  href="/admin/pupils"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  Pupils
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
            <DropdownMenuItem asChild>
              <Link href="/admin/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignOutButton>
                <div className="flex items-center w-full cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </div>
              </SignOutButton>
            </DropdownMenuItem>
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
              href="/admin/daily-reports"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <BookOpen className="h-4 w-4" />
              Daily Reports
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
            <Link
              href="/admin/loan"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Calendar className="h-4 w-4" />
              Staff Loan
            </Link>
          </nav>
        </aside>
        <main className="flex flex-col gap-6 p-4 md:gap-8 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div className="grid gap-1">
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome to the admin dashboard. Manage results, pupils, and classes.
              </p>
            </div>
            <div className="flex-1" />
            <Protect>
              <Button asChild>
                <Link href="/admin/results/new" className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Enter New Result</span>
                </Link>
              </Button>
            </Protect>
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
                    <CardTitle className="text-sm font-medium">Total Pupils</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalPupils}</div>
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
                    <CardTitle className="text-sm font-medium">Daily Reports</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reportsAnalytics.totalReports}</div>
                    <p className="text-xs text-muted-foreground">
                      Total reports submitted by staff
                    </p>
                    <Button variant="link" className="px-0 h-auto text-xs" asChild>
                      <Link href="/admin/daily-reports">View All Reports</Link>
                    </Button>
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
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Loan Requests</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loanAnalytics.pending}</div>
                    <p className="text-xs text-muted-foreground">
                      Pending approval ({loanAnalytics.total} total)
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
                              {result.class} - {result.term} - {result.pupilName}
                            </div>
                            <div className="ml-auto text-sm text-muted-foreground">{result.date}</div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ID {result.pupilId}, average score {result.averageScore}% ({result.grade || "No grade"})
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
                              <TableHead>Pupils</TableHead>
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
                              <TableHead>Pupils</TableHead>
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
                        <span>At-risk pupils</span>
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
                              <TableHead>Pupil</TableHead>
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
                                    <span>{result.pupilName}</span>
                                    <span className="text-xs text-muted-foreground">{result.pupilId}</span>
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
