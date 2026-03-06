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
                topicsTaught: content?.topicsTaught,
                incidentReport: content?.incidentReport,
                homework: content?.homework,
                generalComment: content?.generalComment,
                staffEmail: r.submittedBy
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
    <div className="flex flex-col gap-6 p-4 md:gap-8 md:p-8">
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
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
    </div>
  )
}