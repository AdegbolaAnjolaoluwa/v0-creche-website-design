"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Download, FileText, Filter, Plus, Search, User } from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample children data for the parent
const childrenData = [
  {
    id: "BH-N2-001",
    name: "Agboola Jasmine",
    class: "Nursery 2",
    age: 4,
    gender: "Female",
  },
  {
    id: "BH-N1-002",
    name: "Adedoyin Judith",
    class: "Nursery 1",
    age: 3,
    gender: "Female",
  },
]

// Sample results data for the children
const resultsData = [
  {
    id: "R001",
    studentId: "BH-N2-001",
    studentName: "Agboola Jasmine",
    class: "Nursery 2",
    term: "Term 2",
    averageScore: 78.5,
    grade: "A",
    date: "2023-03-15",
    status: "Published",
  },
  {
    id: "R002",
    studentId: "BH-N2-001",
    studentName: "Agboola Jasmine",
    class: "Nursery 2",
    term: "Term 1",
    averageScore: 82.3,
    grade: "A",
    date: "2022-12-10",
    status: "Published",
  },
  {
    id: "R003",
    studentId: "BH-N1-002",
    studentName: "Adedoyin Judith",
    class: "Nursery 1",
    term: "Term 2",
    averageScore: 85.8,
    grade: "A",
    date: "2023-03-14",
    status: "Published",
  },
  {
    id: "R004",
    studentId: "BH-N1-002",
    studentName: "Adedoyin Judith",
    class: "Nursery 1",
    term: "Term 1",
    averageScore: 79.2,
    grade: "A",
    date: "2022-12-10",
    status: "Published",
  },
]

export default function ParentResultsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTerm, setSelectedTerm] = useState("all")
  const [selectedChild, setSelectedChild] = useState("all")

  // Filter results based on search and filters
  const filteredResults = resultsData.filter((result) => {
    const matchesSearch =
      result.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.date.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTerm = selectedTerm === "all" || result.term === selectedTerm
    const matchesChild = selectedChild === "all" || result.studentId === selectedChild

    return matchesSearch && matchesTerm && matchesChild
  })

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/parent/dashboard" className="flex items-center gap-2 font-semibold">
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
              <span className="hidden md:inline-block">Parent User</span>
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
              href="/parent/dashboard"
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
              href="/parent/results"
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
            >
              <FileText className="h-4 w-4" />
              Results
            </Link>
            <Link
              href="/parent/settings"
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
              <p className="text-muted-foreground">View your children's academic results</p>
            </div>
            <div className="flex-1 grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:ml-auto">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by term or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedChild} onValueChange={setSelectedChild}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Filter by child" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Children</SelectItem>
                    {childrenData.map((child) => (
                      <SelectItem key={child.id} value={child.id}>
                        {child.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            </div>
          </div>

          <Tabs defaultValue="results" className="space-y-4">
            <TabsList>
              <TabsTrigger value="results">Results List</TabsTrigger>
              <TabsTrigger value="children">Children</TabsTrigger>
            </TabsList>
            <TabsContent value="results" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="grid gap-1">
                    <CardTitle>Academic Results</CardTitle>
                    <CardDescription>{filteredResults.length} results found</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Child</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Term</TableHead>
                          <TableHead className="text-center">Average</TableHead>
                          <TableHead className="text-center">Grade</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredResults.length > 0 ? (
                          filteredResults.map((result) => (
                            <TableRow key={result.id}>
                              <TableCell className="font-medium">{result.studentName}</TableCell>
                              <TableCell>{result.class}</TableCell>
                              <TableCell>{result.term}</TableCell>
                              <TableCell className="text-center">{result.averageScore.toFixed(1)}%</TableCell>
                              <TableCell className="text-center">
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
                              </TableCell>
                              <TableCell>{result.date}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
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
                            <TableCell colSpan={7} className="h-24 text-center">
                              No results found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="children" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {childrenData.map((child) => (
                  <Card key={child.id}>
                    <CardHeader>
                      <CardTitle>{child.name}</CardTitle>
                      <CardDescription>{child.class}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Student ID</p>
                            <p className="font-medium">{child.id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Age</p>
                            <p className="font-medium">{child.age} years</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Gender</p>
                          <p className="font-medium">{child.gender}</p>
                        </div>
                        <div className="pt-2">
                          <Button variant="outline" className="w-full" asChild>
                            <Link href={`/parent/results?child=${child.id}`}>View Results</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
