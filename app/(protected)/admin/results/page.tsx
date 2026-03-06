"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Download, FileText, Filter, Search, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

import { type ResultRecord } from "@/lib/data"

export const calculateAttendanceScore = (attendancePercentage: number) => {
  if (attendancePercentage >= 95) return 10
  if (attendancePercentage >= 90) return 8
  if (attendancePercentage >= 80) return 6
  if (attendancePercentage >= 70) return 4
  return 2
}

export const calculateFinalScore = (academicScore: number, attendanceScore: number) => academicScore + attendanceScore

export default function ResultsPage() {
  const [results, setResults] = useState<ResultRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/results")
      if (res.ok) {
        const data = await res.json()
        const mapped = data.map((r: any) => ({
            ...r,
            class: r.classId, // Map classId to class
            pupilName: r.studentName, // Map studentName to pupilName
            pupilId: r.studentId, // Map studentId to pupilId
            date: new Date(r.updatedAt).toISOString().split('T')[0] // Format date
        }))
        setResults(mapped)
      }
    } catch (e) {
      console.error("Failed to fetch results", e)
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleConfirmDelete = async () => {
    if (!resultToDelete) return
    
    // Optimistic update
    const updated = results.filter((result) => result.id !== resultToDelete.id)
    setResults(updated)
    
    try {
        await fetch(`/api/admin/results?id=${resultToDelete.id}`, { method: 'DELETE' })
    } catch (e) {
        console.error("Failed to delete", e)
    }

    setIsDeleteOpen(false)
    setResultToDelete(null)
  }

  const handleCancelDelete = () => {
    setIsDeleteOpen(false)
    setResultToDelete(null)
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:gap-8 md:p-8">
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Loading results...
                    </TableCell>
                  </TableRow>
                ) : filteredResults.length > 0 ? (
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
    </div>
  )
}