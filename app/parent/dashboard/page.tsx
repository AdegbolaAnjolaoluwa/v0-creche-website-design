"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BarChart3, BookOpen, ChevronDown, Download, FileText, Home, LogOut, Menu, Settings, User } from "lucide-react"

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

// Sample student data
const studentData = {
  name: "Agboola Jasmine",
  id: "BH-N2-001",
  class: "Nursery 2",
  term: "Term 2",
  results: [
    {
      subject: "Reading",
      midterm: 85,
      exam: 78,
      total: 80.8,
      grade: "A",
    },
    {
      subject: "Writing",
      midterm: 72,
      exam: 68,
      total: 69.6,
      grade: "B",
    },
    {
      subject: "Arithmetic",
      midterm: 65,
      exam: 70,
      total: 68,
      grade: "B",
    },
    {
      subject: "Arts & Crafts",
      midterm: 90,
      exam: 85,
      total: 87,
      grade: "A",
    },
    {
      subject: "Science",
      midterm: 75,
      exam: 72,
      total: 73.2,
      grade: "A",
    },
    {
      subject: "Social Studies",
      midterm: 68,
      exam: 65,
      total: 66.2,
      grade: "B",
    },
    {
      subject: "Physical Education",
      midterm: 88,
      exam: 90,
      total: 89.2,
      grade: "A",
    },
    {
      subject: "Music",
      midterm: 82,
      exam: 78,
      total: 79.6,
      grade: "A",
    },
  ],
  previousTerms: [
    {
      term: "Term 1",
      year: "2023/2024",
      averageScore: 76.5,
      date: "December 15, 2023",
    },
  ],
}

export default function ParentDashboard() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  // Calculate average score
  const averageScore = studentData.results.reduce((acc, result) => acc + result.total, 0) / studentData.results.length

  // Count grades
  const gradeCount = studentData.results.reduce(
    (acc, result) => {
      acc[result.grade] = (acc[result.grade] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
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
                href="/parent/dashboard"
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
                  href="/parent/dashboard"
                  className="flex items-center gap-2 text-primary"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/parent/results"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <FileText className="h-5 w-5" />
                  Results
                </Link>
                <Link
                  href="/parent/settings"
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
              <span className="hidden md:inline-block">Parent Account</span>
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
              href="/parent/dashboard"
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/parent/results"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <FileText className="h-4 w-4" />
              Results
            </Link>
            <Link
              href="/parent/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </aside>
        <main className="flex flex-col gap-6 p-4 md:gap-8 md:p-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
            <p className="text-muted-foreground">Welcome to the parent portal. View your child's academic progress.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Student Name</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{studentData.name}</div>
                <p className="text-xs text-muted-foreground">ID: {studentData.id}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Class</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{studentData.class}</div>
                <p className="text-xs text-muted-foreground">{studentData.term}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{averageScore.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Grade:{" "}
                  {averageScore >= 70
                    ? "A"
                    : averageScore >= 60
                      ? "B"
                      : averageScore >= 50
                        ? "C"
                        : averageScore >= 40
                          ? "D"
                          : "F"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{studentData.results.length}</div>
                <p className="text-xs text-muted-foreground">
                  {gradeCount.A || 0} A's, {gradeCount.B || 0} B's, {gradeCount.C || 0} C's
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="current" className="space-y-4">
            <TabsList>
              <TabsTrigger value="current">Current Results</TabsTrigger>
              <TabsTrigger value="previous">Previous Terms</TabsTrigger>
            </TabsList>
            <TabsContent value="current" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Term Results</CardTitle>
                    <CardDescription>
                      {studentData.class} - {studentData.term}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
                      <div className="col-span-4">Subject</div>
                      <div className="col-span-2 text-center">Midterm</div>
                      <div className="col-span-2 text-center">Exam</div>
                      <div className="col-span-2 text-center">Total</div>
                      <div className="col-span-2 text-center">Grade</div>
                    </div>
                    <div className="divide-y">
                      {studentData.results.map((result) => (
                        <div key={result.subject} className="grid grid-cols-12 gap-2 p-4 items-center">
                          <div className="col-span-4">{result.subject}</div>
                          <div className="col-span-2 text-center">{result.midterm}</div>
                          <div className="col-span-2 text-center">{result.exam}</div>
                          <div className="col-span-2 text-center">{result.total.toFixed(1)}</div>
                          <div className="col-span-2 text-center">
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
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 p-4 border rounded-md bg-muted/20">
                    <h4 className="font-medium mb-2">Grading System</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                      <div>A: 70-100%</div>
                      <div>B: 60-69%</div>
                      <div>C: 50-59%</div>
                      <div>D: 40-49%</div>
                      <div>F: Below 40%</div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Teacher's Comment</h4>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm">
                        Alex has shown good progress this term. Particularly strong in Arts & Crafts and Physical
                        Education. Continue to encourage reading at home to further improve literacy skills.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="previous" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Previous Term Results</CardTitle>
                  <CardDescription>View results from previous academic terms</CardDescription>
                </CardHeader>
                <CardContent>
                  {studentData.previousTerms.length > 0 ? (
                    <div className="space-y-4">
                      {studentData.previousTerms.map((term, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                          <div>
                            <h4 className="font-medium">
                              {term.term} - {term.year}
                            </h4>
                            <p className="text-sm text-muted-foreground">Average Score: {term.averageScore}%</p>
                            <p className="text-xs text-muted-foreground">Published: {term.date}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">No Previous Results</h3>
                        <p className="text-sm text-muted-foreground">
                          Previous term results will appear here when available.
                        </p>
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
