"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useClerk, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { ArrowLeft, Banknote, ChevronDown, FileText, Filter, LogOut, Search, User, Users } from "lucide-react"

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

import { classesData, resultsData, type ResultRecord } from "@/lib/data"

export default function StaffResultsPage() {
  const { signOut } = useClerk()
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  
  const currentUser = useMemo(() => {
    if (!user) return null
    return {
      role: (user.publicMetadata.role as string) || "staff",
      email: user.primaryEmailAddress?.emailAddress,
      classId: (user.publicMetadata.classId as string)
    }
  }, [user])

  const [results, setResults] = useState<ResultRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTerm, setSelectedTerm] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/login?type=staff")
      return
    }
    fetchResults()
  }, [isLoaded, isSignedIn, router])

  const fetchResults = async () => {
    try {
      const res = await fetch("/api/admin/results")
      if (res.ok) {
        const data = await res.json()
        const mapped = data.map((r: any) => ({
            ...r,
            class: r.classId,
            pupilName: r.studentName,
            pupilId: r.studentId,
            date: new Date(r.updatedAt).toISOString().split('T')[0]
        }))
        setResults(mapped)
      }
    } catch (e) {
      console.error("Failed to fetch results", e)
    }
  }

  const assignedClassName = useMemo(() => {
    if (!currentUser) return null
    const cls = classesData.find((item) => item.id === currentUser.classId)
    return cls ? cls.name : null
  }, [currentUser])

  const filteredResults = useMemo(() => {
    if (!assignedClassName) return []
    return results.filter((result) => {
      if (!result) return false
      if (result.class !== assignedClassName) return false

      const term = (searchTerm || "").toLowerCase()
      const matchesSearch =
        (result.pupilName || "").toLowerCase().includes(term) ||
        (result.pupilId || "").toLowerCase().includes(term)

      const matchesTerm = selectedTerm === "all" || result.term === selectedTerm
      const matchesStatus = selectedStatus === "all" || result.status === selectedStatus

      return matchesSearch && matchesTerm && matchesStatus
    })
  }, [results, assignedClassName, searchTerm, selectedTerm, selectedStatus])

  const handleLogout = () => { signOut(() => { router.push("/login?type=staff") }) }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
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
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <div className="grid gap-1">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" asChild>
                <Link href="/staff/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Link>
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">Class Results</h1>
            </div>
            <p className="text-muted-foreground">
              View results for your assigned class{assignedClassName ? ` (${assignedClassName})` : ""}.
            </p>
          </div>
          <div className="flex-1 grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:ml-auto">
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
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Filter by term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Terms</SelectItem>
                  <SelectItem value="Term 1">Term 1</SelectItem>
                  <SelectItem value="Term 2">Term 2</SelectItem>
                  <SelectItem value="Term 3">Term 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="grid gap-1">
              <CardTitle>Results</CardTitle>
              <CardDescription>
                {assignedClassName ? `Results for ${assignedClassName}` : "Results for your class"}
              </CardDescription>
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
                        <TableCell className="text-center">{result.status === "Draft" ? "-" : result.grade}</TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              result.status === "Published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {result.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" asChild>
                              <Link href={`/parent/results/${result.id}`}>
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">View result sheet</span>
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No results found for your class.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
