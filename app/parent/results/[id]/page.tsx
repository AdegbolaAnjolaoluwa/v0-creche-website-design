"use client"
import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { ArrowLeft, ChevronDown, Download, Printer, User } from "lucide-react"

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
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample result data
const resultDetails = {
  id: "R001",
  studentId: "BH-N2-001",
  studentName: "Agboola Jasmine",
  class: "Nursery 2",
  term: "Term 2",
  academicYear: "2023-2024",
  averageScore: 78.5,
  grade: "A",
  date: "2023-03-15",
  status: "Published",
  teacherComment:
    "John has shown remarkable improvement in his reading skills. He actively participates in class activities and is always eager to learn. He should continue to work on his handwriting.",
  principalComment: "Well done, Jasmine! Keep up the good work and continue to strive for excellence.",
  subjects: [
    { name: "English Language", score: 85, grade: "A", comment: "Excellent reading and comprehension skills" },
    { name: "Mathematics", score: 78, grade: "A", comment: "Good understanding of basic arithmetic" },
    { name: "Science", score: 82, grade: "A", comment: "Shows keen interest in nature and experiments" },
    { name: "Social Studies", score: 75, grade: "A", comment: "Good participation in group activities" },
    { name: "Arts & Crafts", score: 90, grade: "A", comment: "Very creative and attentive to detail" },
    { name: "Physical Education", score: 88, grade: "A", comment: "Excellent coordination and team spirit" },
    { name: "Music", score: 72, grade: "B", comment: "Shows interest in rhythm and singing" },
    { name: "Handwriting", score: 65, grade: "B", comment: "Needs more practice for better letter formation" },
  ],
  attendance: {
    daysPresent: 58,
    daysAbsent: 2,
    totalDays: 60,
    percentage: 96.7,
  },
  skills: [
    { name: "Communication", rating: "Excellent" },
    { name: "Teamwork", rating: "Very Good" },
    { name: "Problem Solving", rating: "Good" },
    { name: "Creativity", rating: "Excellent" },
    { name: "Self-Management", rating: "Very Good" },
  ],
}

export default function ResultDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const resultId = params.id

  // In a real application, you would fetch the result data based on the ID
  // For this example, we're using the sample data

  const handlePrint = () => {
    window.print()
  }

  useEffect(() => {
    if (searchParams?.get("download") === "1") {
      handlePrint()
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 print:hidden">
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
        <aside className="hidden border-r bg-muted/40 md:block print:hidden">
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
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
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
          <div className="flex items-center gap-4 print:hidden">
            <Button variant="outline" size="sm" asChild>
              <Link href="/parent/results">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Results
              </Link>
            </Button>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>

          <div className="print:mt-0">
            <div className="text-center mb-6 print:mb-4">
              <div className="flex items-center justify-center mb-2">
                <Image
                  src="/logo.jpg"
                  alt="Bayhood Preparatory School logo"
                  width={280}
                  height={84}
                  className="h-16 w-auto"
                />
              </div>
              <p className="text-muted-foreground">
                House 20, Road 18 Diamond Estate, Idimu, Lagos 100275
              </p>
              <h2 className="text-xl font-semibold mt-4">End of Term Report Card</h2>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Student Name</p>
                    <p className="font-medium">{resultDetails.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Student ID</p>
                    <p className="font-medium">{resultDetails.studentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Class</p>
                    <p className="font-medium">{resultDetails.class}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Term</p>
                    <p className="font-medium">
                      {resultDetails.term}, {resultDetails.academicYear}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="academic" className="space-y-4">
              <TabsList className="print:hidden">
                <TabsTrigger value="academic">Academic Performance</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="skills">Skills & Development</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>

              <TabsContent value="academic" className="space-y-4 print:block">
                <div className="print:mb-6">
                  <h3 className="text-lg font-semibold mb-4 print:mb-2">Subject Performance</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead className="text-center">Score (%)</TableHead>
                          <TableHead className="text-center">Grade</TableHead>
                          <TableHead>Teacher's Comment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resultDetails.subjects.map((subject) => (
                          <TableRow key={subject.name}>
                            <TableCell className="font-medium">{subject.name}</TableCell>
                            <TableCell className="text-center">{subject.score}</TableCell>
                            <TableCell className="text-center">
                              <span
                                className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  subject.grade === "A"
                                    ? "bg-green-100 text-green-800"
                                    : subject.grade === "B"
                                      ? "bg-blue-100 text-blue-800"
                                      : subject.grade === "C"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : subject.grade === "D"
                                          ? "bg-orange-100 text-orange-800"
                                          : "bg-red-100 text-red-800"
                                }`}
                              >
                                {subject.grade}
                              </span>
                            </TableCell>
                            <TableCell>{subject.comment}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <Card className="print:mb-6">
                  <CardHeader>
                    <CardTitle>Overall Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            Average Score: {resultDetails.averageScore.toFixed(1)}%
                          </span>
                          <span className="text-sm font-medium">Grade: {resultDetails.grade}</span>
                        </div>
                        <Progress value={resultDetails.averageScore} className="h-2" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Highest Subject</p>
                          <p className="font-medium">
                            {
                              resultDetails.subjects.reduce((prev, current) =>
                                prev.score > current.score ? prev : current,
                              ).name
                            }
                            (
                            {
                              resultDetails.subjects.reduce((prev, current) =>
                                prev.score > current.score ? prev : current,
                              ).score
                            }
                            %)
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Lowest Subject</p>
                          <p className="font-medium">
                            {
                              resultDetails.subjects.reduce((prev, current) =>
                                prev.score < current.score ? prev : current,
                              ).name
                            }
                            (
                            {
                              resultDetails.subjects.reduce((prev, current) =>
                                prev.score < current.score ? prev : current,
                              ).score
                            }
                            %)
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attendance" className="space-y-4 print:block print:mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Record</CardTitle>
                    <CardDescription>
                      {resultDetails.term}, {resultDetails.academicYear}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            Attendance Rate: {resultDetails.attendance.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={resultDetails.attendance.percentage} className="h-2" />
                      </div>
                      <div className="grid grid-cols-3 gap-4 pt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Days Present</p>
                          <p className="font-medium">{resultDetails.attendance.daysPresent} days</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Days Absent</p>
                          <p className="font-medium">{resultDetails.attendance.daysAbsent} days</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total School Days</p>
                          <p className="font-medium">{resultDetails.attendance.totalDays} days</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="space-y-4 print:block print:mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Development</CardTitle>
                    <CardDescription>Assessment of non-academic skills and personal development</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Skill</TableHead>
                            <TableHead>Rating</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {resultDetails.skills.map((skill) => (
                            <TableRow key={skill.name}>
                              <TableCell className="font-medium">{skill.name}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    skill.rating === "Excellent"
                                      ? "bg-green-100 text-green-800"
                                      : skill.rating === "Very Good"
                                        ? "bg-blue-100 text-blue-800"
                                        : skill.rating === "Good"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : skill.rating === "Satisfactory"
                                            ? "bg-orange-100 text-orange-800"
                                            : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {skill.rating}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comments" className="space-y-4 print:block print:mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Teacher's Comment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{resultDetails.teacherComment}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Principal's Comment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{resultDetails.principalComment}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-8 print:mt-6 print:block">
              <Separator className="my-4" />
              <div className="flex flex-col md:flex-row justify-between gap-4 text-sm text-muted-foreground">
                <div>
                  <p>Report Date: {resultDetails.date}</p>
                </div>
                <div>
                  <p>Bayhood Preparatory School - Nurturing Tomorrow's Leaders</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
