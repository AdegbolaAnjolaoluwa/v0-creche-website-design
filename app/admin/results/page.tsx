"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BookOpen, ChevronDown, Download, FileText, Filter, Plus, Search, Trash, User, Users, Edit } from "lucide-react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { resultsData, type ResultRecord } from "@/lib/data"

const RESULTS_STORAGE_KEY = "adminResults"

const loadResultsFromStorage = (): ResultRecord[] => {
  if (typeof window === "undefined") return resultsData
  const stored = window.localStorage.getItem(RESULTS_STORAGE_KEY)
  if (!stored) {
    window.localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(resultsData))
    return resultsData
  }
  try {
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) {
      return resultsData
    }
    // Migration: ensure old studentName/studentId keys are mapped to pupilName/pupilId
    const migrated = parsed
      .filter(item => item !== null && item !== undefined)
      .map((item: any) => ({
        ...item,
        pupilId: item.pupilId || item.studentId || "",
        pupilName: item.pupilName || item.studentName || "",
      }))
    return migrated as ResultRecord[]
  } catch {
    return resultsData
  }
}

export const calculateAttendanceScore = (attendancePercentage: number) => {
  if (attendancePercentage >= 95) return 10
  if (attendancePercentage >= 90) return 8
  if (attendancePercentage >= 80) return 6
  if (attendancePercentage >= 70) return 4
  return 2
}

export const calculateFinalScore = (academicScore: number, attendanceScore: number) => academicScore + attendanceScore

export default function ResultsPage() {
  const [results, setResults] = useState<ResultRecord[]>(() => loadResultsFromStorage())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedTerm, setSelectedTerm] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [resultToDelete, setResultToDelete] = useState<{ id: string; pupilName: string } | null>(null)

  // Filter results based on search and filters
  const filteredResults = results.filter((result) => {
    if (!result) return false
    
    const term = (searchTerm || "").toLowerCase()
    const matchesSearch =
      (result.pupilName || "").toLowerCase().includes(term) ||
      (result.pupilId || "").toLowerCase().includes(term) ||
      (result.id || "").toLowerCase().includes(term)

    const matchesClass = selectedClass === "all" || result.class === selectedClass
    const matchesTerm = selectedTerm === "all" || result.term === selectedTerm
    const matchesStatus = selectedStatus === "all" || result.status === selectedStatus

    return matchesSearch && matchesClass && matchesTerm && matchesStatus
  })

  const handleDeleteClick = (result: ResultRecord) => {
    setResultToDelete({ id: result.id, pupilName: result.pupilName })
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!resultToDelete) return
    setResults((prev) => {
      const updated = prev.filter((result) => result.id !== resultToDelete.id)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(updated))
      }
      return updated
    })
    setIsDeleteOpen(false)
    setResultToDelete(null)
  }

  const handleCancelDelete = () => {
    setIsDeleteOpen(false)
    setResultToDelete(null)
  }

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
              <span className="hidden md:inline-block">Admin User</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href="/">
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </Link>
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
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Dashboard
            </Link>
            <Link
              href="/admin/results"
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
            >
              <FileText className="h-4 w-4" />
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
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
              </svg>
              Classes
            </Link>
            <Link
              href="/admin/attendance"
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
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
              </svg>
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
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div className="grid gap-1">
              <h1 className="text-2xl font-bold tracking-tight">Results</h1>
              <p className="text-muted-foreground">Manage and view all pupil results</p>
            </div>
            <div className="flex-1 grid gap-4 md:grid-cols-2 lg:grid-cols-2 md:gap-8 md:ml-auto">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Filter by class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="Creche">Creche</SelectItem>
                    <SelectItem value="Playgroup">Playgroup</SelectItem>
                    <SelectItem value="Preschool 1">Preschool 1</SelectItem>
                    <SelectItem value="Preschool 2">Preschool 2</SelectItem>
                    <SelectItem value="Nursery 1">Nursery 1</SelectItem>
                    <SelectItem value="Nursery 2">Nursery 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="grid gap-1">
                <CardTitle>All Results</CardTitle>
                <CardDescription>{filteredResults.length} results found</CardDescription>
              </div>
              <div className="ml-auto flex gap-2">
                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                  <SelectTrigger className="h-8 w-[130px]">
                    <SelectValue placeholder="Filter by term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Terms</SelectItem>
                    <SelectItem value="Term 1">Term 1</SelectItem>
                    <SelectItem value="Term 2">Term 2</SelectItem>
                    <SelectItem value="Term 3">Term 3</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="h-8 w-[130px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pupil ID</TableHead>
                      <TableHead>Pupil Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead className="text-center">Average</TableHead>
                      <TableHead className="text-center">Attendance</TableHead>
                      <TableHead className="text-center">Final Score</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.length > 0 ? (
                      filteredResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">{result.pupilId}</TableCell>
                          <TableCell>{result.pupilName}</TableCell>
                          <TableCell>{result.class}</TableCell>
                          <TableCell>{result.term}</TableCell>
                          <TableCell className="text-center">
                            {result.status === "Draft" ? "-" : `${result.averageScore.toFixed(1)}%`}
                          </TableCell>
                          <TableCell className="text-center">
                            {result.status === "Draft" || result.attendancePercentage == null
                              ? "-"
                              : `${result.attendancePercentage.toFixed(1)}%`}
                          </TableCell>
                          <TableCell className="text-center">
                            {result.status === "Draft" || result.finalScore == null
                              ? "-"
                              : result.finalScore.toFixed(1)}
                          </TableCell>
                          <TableCell className="text-center">
                            {result.status === "Draft" ? (
                              "-"
                            ) : (
                              <span
                                className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  result.grade === "A"
                                    ? "bg-green-100 text-green-800"
                                    : result.grade === "B"
                                      ? "bg-blue-100 text-blue-800"
                                      : result.grade === "C"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : result.grade === "D"
                                          ? "bg-orange-100 text-orange-800"
                                          : "bg-red-100 text-red-800"
                                }`}
                              >
                                {result.grade}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                result.status === "Published"
                                  ? "bg-green-100 text-green-800"
                                  : result.status === "Pending Approval"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {result.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="icon" asChild>
                                <Link href={`/admin/results/${result.id}/edit`}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Link>
                              </Button>
                              <Button variant="outline" size="icon" asChild>
                                <Link href={`/parent/results/${result.id}`}>
                                  <FileText className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Link>
                              </Button>
                              <Button variant="outline" size="icon" asChild>
                                <Link href={`/parent/results/${result.id}?download=1`} target="_blank">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No results found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Delete result</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the result for{" "}
                  <span className="font-semibold">{resultToDelete?.pupilName}</span>? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCancelDelete}>
                  Cancel
                </Button>
                <Button type="button" variant="destructive" onClick={handleConfirmDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
