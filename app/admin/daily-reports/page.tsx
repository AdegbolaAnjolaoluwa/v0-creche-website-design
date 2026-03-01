"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useClerk, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { BookOpen, Calendar, ChevronDown, Eye, Filter, Home, LogOut, Menu, Search, User, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { classesData } from "@/lib/data"

type CurrentUser = {
  role: string
  email?: string
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

export default function AdminDailyReportsPage() {
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

  const [dailyReports, setDailyReports] = useState<DailyReport[]>([])
  const [filterDate, setFilterDate] = useState("")
  const [filterClassId, setFilterClassId] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/login?type=admin")
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/daily-reports")
      if (res.ok) {
        const data = await res.json()
        const mapped = data.map((r: any) => {
            const content = typeof r.content === 'string' ? JSON.parse(r.content) : r.content
            return {
                ...r,
                topicsTaught: content.topicsTaught,
                incidentReport: content.incidentReport,
                homework: content.homework,
                generalComment: content.generalComment,
                staffEmail: r.submittedBy // Mapping for now
            }
        })
        setDailyReports(mapped)
      }
    } catch (e) {
      console.error("Failed to fetch reports", e)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredReports = useMemo(() => {
    return dailyReports
      .filter((report) => {
        if (filterDate && report.date !== filterDate) return false
        if (filterClassId !== "all" && report.classId !== filterClassId) return false
        
        const matchesSearch = 
          report.staffEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.topicsTaught.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.incidentReport.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.generalComment.toLowerCase().includes(searchTerm.toLowerCase())
          
        return matchesSearch
      })
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
  }, [dailyReports, filterDate, filterClassId, searchTerm])

  const handleApproveReport = (reportId: string) => {
    if (!currentUser) return
    const updated = dailyReports.map((report) => {
      if (report.id === reportId) {
        return {
          ...report,
          approvalStatus: "Approved" as const,
          approvedBy: currentUser.email,
          approvedAt: new Date().toISOString(),
        }
      }
      return report
    })
    setDailyReports(updated)
    window.localStorage.setItem(DAILY_REPORTS_KEY, JSON.stringify(updated))
  }

  const handleLogout = () => { signOut(() => { router.push("/login") }) }

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
              href="/admin/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
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
              <BookOpen className="h-4 w-4" />
              Results
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
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Calendar className="h-4 w-4" />
              Attendance
            </Link>
            <Link
              href="/admin/daily-reports"
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
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
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Settings
            </Link>
          </nav>
        </aside>
        <main className="flex flex-col gap-6 p-4 md:gap-8 md:p-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Daily Reports</h1>
            <p className="text-muted-foreground">
              Review all daily reports submitted by teachers.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Filter reports by date, class, or search keywords.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
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
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search reports..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reports History</CardTitle>
              <CardDescription>
                Showing {filteredReports.length} reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredReports.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No daily reports found matching the filters.
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Staff Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          Loading reports...
                        </TableCell>
                      </TableRow>
                    ) : filteredReports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No reports found matching the filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReports.map((report) => {
                        const cls = classesData.find((c) => c.id === report.classId)
                        const isApproved = report.approvalStatus === "Approved"
                        return (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.date}</TableCell>
                            <TableCell>{cls?.name || report.classId}</TableCell>
                            <TableCell>{report.staffEmail}</TableCell>
                            <TableCell>
                              {isApproved ? (
                                <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 border-none">
                                  Approved
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none">
                                  Pending
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="h-8 gap-1">
                                    <Eye className="h-3.5 w-3.5" />
                                    <span>Details</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      Daily Report Details
                                      {isApproved && (
                                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 border-none text-[10px] h-5">
                                          Approved
                                        </Badge>
                                      )}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Submitted by {report.staffEmail} for {cls?.name || report.classId} on {report.date}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-start gap-4">
                                      <Label className="text-right font-bold">Date</Label>
                                      <div className="col-span-3 text-sm">{report.date}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-start gap-4">
                                      <Label className="text-right font-bold">Class</Label>
                                      <div className="col-span-3 text-sm">{cls?.name || report.classId}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-start gap-4">
                                      <Label className="text-right font-bold">Staff</Label>
                                      <div className="col-span-3 text-sm">{report.staffEmail}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-start gap-4 border-t pt-4">
                                      <Label className="text-right font-bold">Topics Taught</Label>
                                      <div className="col-span-3 text-sm whitespace-pre-wrap">{report.topicsTaught || "None recorded"}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-start gap-4">
                                      <Label className="text-right font-bold">Incident Report</Label>
                                      <div className="col-span-3 text-sm whitespace-pre-wrap">{report.incidentReport || "None recorded"}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-start gap-4">
                                      <Label className="text-right font-bold">Homework</Label>
                                      <div className="col-span-3 text-sm whitespace-pre-wrap">{report.homework || "None recorded"}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-start gap-4 border-t pt-4">
                                      <Label className="text-right font-bold">General Comment</Label>
                                      <div className="col-span-3 text-sm whitespace-pre-wrap">{report.generalComment || "None recorded"}</div>
                                    </div>
                                    {isApproved && (
                                      <div className="grid grid-cols-4 items-start gap-4 border-t pt-4 bg-green-50/30 p-2 rounded">
                                        <Label className="text-right font-bold text-green-700">Signed Off By</Label>
                                        <div className="col-span-3 text-sm text-green-800">
                                          {report.approvedBy}
                                        </div>
                                      </div>
                                    )}
                                    <div className="grid grid-cols-4 items-start gap-4 text-muted-foreground text-[10px] mt-4">
                                      <Label className="text-right font-normal">Created At</Label>
                                      <div className="col-span-3">{new Date(report.createdAt).toLocaleString()}</div>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    {!isApproved ? (
                                      <Button 
                                        onClick={() => handleApproveReport(report.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                      >
                                        Sign Off Report
                                      </Button>
                                    ) : (
                                      <DialogClose asChild>
                                        <Button variant="outline">Close</Button>
                                      </DialogClose>
                                    )}
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}