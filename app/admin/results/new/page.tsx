"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronDown, LogOut, Save, User } from "lucide-react"

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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import { studentsData, type Student } from "../../students/page"
import { classesData } from "../../classes/page"
import { resultsData, type ResultRecord, calculateAttendanceScore, calculateFinalScore } from "../page"

const subjects = {
  creche: ["Motor Skills", "Social Interaction", "Basic Recognition", "Sensory Development"],
  "nursery-1": ["Alphabets", "Numbers", "Coloring", "Rhymes", "Basic Writing", "Social Skills"],
  "nursery-2": [
    "Reading",
    "Writing",
    "Arithmetic",
    "Arts & Crafts",
    "Science",
    "Social Studies",
    "Physical Education",
    "Music",
  ],
}

type CurrentUser = {
  role: string
  email?: string
  classId?: string
}

type StudentAttendanceRecord = {
  studentId: string
  date: string
  status: "Present" | "Absent" | "Late"
}

const STUDENT_ATTENDANCE_KEY = "studentAttendance"

export default function NewResult() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [assignedClassName, setAssignedClassName] = useState<string | null>(null)
  const [studentId, setStudentId] = useState("")
  const [studentName, setStudentName] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedTerm, setSelectedTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [scores, setScores] = useState<Record<string, { midterm: string; exam: string }>>({})
  const [teacherComment, setTeacherComment] = useState("")

  const RESULTS_STORAGE_KEY = "adminResults"

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("currentUser")
    }
    router.push("/login?type=staff")
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const storedUser = window.localStorage.getItem("currentUser")
    if (!storedUser) {
      router.push("/login?type=staff")
      return
    }
    try {
      const parsed = JSON.parse(storedUser) as CurrentUser
      if (parsed.role !== "staff" || !parsed.classId) {
        router.push("/login?type=staff")
        return
      }
      setCurrentUser(parsed)
      const assignedClass = classesData.find((cls) => cls.id === parsed.classId)
      setAssignedClassName(assignedClass ? assignedClass.name : null)
      if (assignedClass) {
        const key = mapStudentClassToKey(assignedClass.name)
        if (key) {
          handleClassChange(key)
        }
      }
    } catch {
      router.push("/login?type=staff")
    }
  }, [router])

  const mapStudentClassToKey = (className: string) => {
    if (className === "Creche") return "creche"
    if (className === "Nursery 1") return "nursery-1"
    if (className === "Nursery 2") return "nursery-2"
    return ""
  }

  const mapClassKeyToLabel = (classKey: string) => {
    if (classKey === "creche") return "Creche"
    if (classKey === "nursery-1") return "Nursery 1"
    if (classKey === "nursery-2") return "Nursery 2"
    return classKey
  }

  const mapTermKeyToLabel = (termKey: string) => {
    if (termKey === "term-1") return "Term 1"
    if (termKey === "term-2") return "Term 2"
    if (termKey === "term-3") return "Term 3"
    return termKey
  }

  const findStudent = (value: string): Student | undefined => {
    const trimmed = value.trim()
    if (!trimmed) return undefined
    const lower = trimmed.toLowerCase()
    const allowedStudents =
      assignedClassName != null ? studentsData.filter((student) => student.class === assignedClassName) : studentsData
    return (
      allowedStudents.find((student) => student.id.toLowerCase() === lower) ||
      allowedStudents.find((student) => student.name.toLowerCase() === lower)
    )
  }

  const handleStudentMatch = (student: Student | undefined) => {
    if (!student) return
    setStudentId(student.id)
    setStudentName(student.name)
    const classKey = mapStudentClassToKey(student.class)
    if (classKey) {
      handleClassChange(classKey)
    }
  }

  const handleClassChange = (value: string) => {
    setSelectedClass(value)

    // Initialize scores for the selected class subjects
    const initialScores: Record<string, { midterm: string; exam: string }> = {}
    const classSubjects = subjects[value as keyof typeof subjects] ?? []
    classSubjects.forEach((subject) => {
      initialScores[subject] = { midterm: "", exam: "" }
    })
    setScores(initialScores)
  }

  const handleScoreChange = (subject: string, type: "midterm" | "exam", value: string) => {
    // Ensure value is a number between 0-100
    if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
      setScores((prev) => ({
        ...prev,
        [subject]: {
          ...prev[subject],
          [type]: value,
        },
      }))
    }
  }

  const calculateTotal = (subject: string) => {
    const midterm = scores[subject]?.midterm ? Number(scores[subject].midterm) : 0
    const exam = scores[subject]?.exam ? Number(scores[subject].exam) : 0

    // Midterm is 40%, Exam is 60%
    return midterm * 0.4 + exam * 0.6
  }

  const getGrade = (total: number) => {
    if (total >= 70) return "A"
    if (total >= 60) return "B"
    if (total >= 50) return "C"
    if (total >= 40) return "D"
    return "F"
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      if (typeof window !== "undefined") {
        if (!currentUser || !currentUser.classId || !assignedClassName) {
          setIsLoading(false)
          router.push("/login?type=staff")
          return
        }

        const assignedClass = classesData.find((cls) => cls.id === currentUser.classId)
        if (!assignedClass || assignedClass.name !== assignedClassName) {
          setIsLoading(false)
          router.push("/login?type=staff")
          return
        }

        const selectedClassLabel = mapClassKeyToLabel(selectedClass)
        if (selectedClassLabel !== assignedClass.name) {
          setIsLoading(false)
          return
        }

        const matchedStudent = studentsData.find((student) => student.id === studentId)
        if (!matchedStudent || matchedStudent.class !== assignedClass.name) {
          setIsLoading(false)
          return
        }

        const stored = window.localStorage.getItem(RESULTS_STORAGE_KEY)
        let current: ResultRecord[] = resultsData
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as ResultRecord[]
            if (Array.isArray(parsed)) {
              current = parsed
            }
          } catch {
            current = resultsData
          }
        }

        const classSubjects = subjects[selectedClass as keyof typeof subjects] ?? []
        const totals = classSubjects.map((subject) => calculateTotal(subject))
        const averageScore =
          classSubjects.length > 0
            ? totals.reduce((sum, value) => sum + value, 0) / classSubjects.length
            : 0

        const roundedAverageScore = Number(averageScore.toFixed(1))

        let attendancePercentage = 0
        if (studentId) {
          const attendanceRaw = window.localStorage.getItem(STUDENT_ATTENDANCE_KEY)
          if (attendanceRaw) {
            try {
              const parsed = JSON.parse(attendanceRaw) as StudentAttendanceRecord[]
              const byDate = new Map<string, StudentAttendanceRecord["status"]>()
              parsed.forEach((record) => {
                if (record.studentId !== studentId) return
                byDate.set(record.date, record.status)
              })
              const totalDays = byDate.size
              if (totalDays > 0) {
                let presentDays = 0
                byDate.forEach((status) => {
                  if (status === "Absent") return
                  presentDays += 1
                })
                attendancePercentage =
                  Math.round(((presentDays / totalDays) * 100 + Number.EPSILON) * 10) / 10
              }
            } catch {
              attendancePercentage = 0
            }
          }
        }

        const attendanceScore = calculateAttendanceScore(attendancePercentage)
        const finalScore = calculateFinalScore(roundedAverageScore, attendanceScore)

        const numericId = current.reduce((max, result) => {
          const value = Number(result.id.replace("R", ""))
          if (Number.isNaN(value)) return max
          return value > max ? value : max
        }, 0)

        const newIdNumber = numericId + 1
        const newId = `R${String(newIdNumber).padStart(3, "0")}`

        const newResult: ResultRecord = {
          id: newId,
          studentId,
          studentName,
          class: mapClassKeyToLabel(selectedClass),
          term: mapTermKeyToLabel(selectedTerm),
          averageScore: roundedAverageScore,
          grade: getGrade(roundedAverageScore),
          date: new Date().toISOString().slice(0, 10),
          status: selectedStatus || "Draft",
          attendancePercentage,
          attendanceScore,
          finalScore: Number(finalScore.toFixed(1)),
        }

        const updated = [...current, newResult]
        window.localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(updated))
      }

      setIsLoading(false)
      router.push("/staff/dashboard")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/staff/dashboard" className="flex items-center gap-2 font-semibold">
          <Image
            src="/logo.jpg"
            alt="Bayhood Preparatory School logo"
            width={220}
            height={66}
            className="h-14 w-auto"
          />
        </Link>
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
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" asChild>
              <Link href="/staff/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Add New Result</h1>
              <p className="text-muted-foreground">Enter student details and scores to generate a result</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="student" className="space-y-4">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="student">Student Information</TabsTrigger>
                <TabsTrigger value="scores">Scores & Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="student">
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Student Information</CardTitle>
                    <CardDescription>
                      Enter the student details, select the class and term, and add comments
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="student-id">Student ID</Label>
                        <Input
                          id="student-id"
                          placeholder="Enter student ID"
                          value={studentId}
                          onChange={(e) => {
                            const value = e.target.value
                            setStudentId(value)
                            const match = findStudent(value)
                            if (match) {
                              handleStudentMatch(match)
                            }
                          }}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="student-name">Student Name</Label>
                        <Input
                          id="student-name"
                          placeholder="Enter student name"
                          value={studentName}
                          onChange={(e) => {
                            const value = e.target.value
                            setStudentName(value)
                            const match = findStudent(value)
                            if (match) {
                              handleStudentMatch(match)
                            }
                          }}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                        <Select required value={selectedClass} onValueChange={handleClassChange}>
                          <SelectTrigger id="class">
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="creche">Creche</SelectItem>
                            <SelectItem value="nursery-1">Nursery 1</SelectItem>
                            <SelectItem value="nursery-2">Nursery 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="term">Term</Label>
                        <Select required value={selectedTerm} onValueChange={setSelectedTerm}>
                          <SelectTrigger id="term">
                            <SelectValue placeholder="Select term" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="term-1">Term 1</SelectItem>
                            <SelectItem value="term-2">Term 2</SelectItem>
                            <SelectItem value="term-3">Term 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select required value={selectedStatus} onValueChange={setSelectedStatus}>
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Published">Published</SelectItem>
                            <SelectItem value="Draft">Draft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="scores">
                {selectedClass && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Subject Scores</CardTitle>
                      <CardDescription>Enter midterm and exam scores for each subject</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="scores" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="scores">Enter Scores</TabsTrigger>
                          <TabsTrigger value="preview">Preview Result</TabsTrigger>
                        </TabsList>
                        <TabsContent value="scores" className="space-y-4 pt-4">
                          <div className="rounded-md border">
                            <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
                              <div className="col-span-4">Subject</div>
                              <div className="col-span-3 text-center">Midterm (40%)</div>
                              <div className="col-span-3 text-center">Exam (60%)</div>
                              <div className="col-span-2 text-center">Total</div>
                            </div>
                            <div className="divide-y">
                              {subjects[selectedClass as keyof typeof subjects].map((subject) => (
                                <div key={subject} className="grid grid-cols-12 gap-2 p-4 items-center">
                                  <div className="col-span-4">{subject}</div>
                                  <div className="col-span-3">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      placeholder="0-100"
                                      value={scores[subject]?.midterm || ""}
                                      onChange={(e) => handleScoreChange(subject, "midterm", e.target.value)}
                                      className="text-center"
                                    />
                                  </div>
                                  <div className="col-span-3">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      placeholder="0-100"
                                      value={scores[subject]?.exam || ""}
                                      onChange={(e) => handleScoreChange(subject, "exam", e.target.value)}
                                      className="text-center"
                                    />
                                  </div>
                                  <div className="col-span-2 text-center font-medium">
                                    {scores[subject]?.midterm !== "" || scores[subject]?.exam !== ""
                                      ? calculateTotal(subject).toFixed(1)
                                      : "-"}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="preview" className="space-y-4 pt-4">
                          <div className="rounded-md border">
                            <div className="flex flex-col items-center gap-3 border-b p-6 text-center">
                              <Image
                                src="/logo.jpg"
                                alt="Bayhood Preparatory School logo"
                                width={280}
                                height={84}
                                className="h-20 w-auto"
                              />
                              <p className="text-sm text-muted-foreground">Student Result Sheet</p>
                            </div>
                            <div className="p-4 border-b bg-muted/20">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">Student Name:</p>
                                  <p className="text-sm">{studentName || "-"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Student ID:</p>
                                  <p className="text-sm">{studentId || "-"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Class:</p>
                                  <p className="text-sm">
                                    {selectedClass === "creche"
                                      ? "Creche"
                                      : selectedClass === "nursery-1"
                                        ? "Nursery 1"
                                        : "Nursery 2"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Term:</p>
                                  <p className="text-sm">
                                    {selectedTerm === "term-1"
                                      ? "Term 1"
                                      : selectedTerm === "term-2"
                                        ? "Term 2"
                                        : "Term 3"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="p-4">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b">
                                    <th className="py-2 text-left">Subject</th>
                                    <th className="py-2 text-center">Midterm</th>
                                    <th className="py-2 text-center">Exam</th>
                                    <th className="py-2 text-center">Total</th>
                                    <th className="py-2 text-center">Grade</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {subjects[selectedClass as keyof typeof subjects].map((subject) => {
                                    const total = calculateTotal(subject)
                                    return (
                                      <tr key={subject} className="border-b">
                                        <td className="py-2">{subject}</td>
                                        <td className="py-2 text-center">{scores[subject]?.midterm || "-"}</td>
                                        <td className="py-2 text-center">{scores[subject]?.exam || "-"}</td>
                                        <td className="py-2 text-center">
                                          {scores[subject]?.midterm !== "" || scores[subject]?.exam !== ""
                                            ? total.toFixed(1)
                                            : "-"}
                                        </td>
                                        <td className="py-2 text-center">
                                          {scores[subject]?.midterm !== "" || scores[subject]?.exam !== ""
                                            ? getGrade(total)
                                            : "-"}
                                        </td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>

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
                              <div className="mt-6 p-4 border rounded-md bg-muted/10">
                                <h4 className="font-medium mb-2">Teacher's Comment</h4>
                                <p className="text-sm whitespace-pre-line">
                                  {teacherComment || "No comment provided."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                )}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Teacher's Comment</CardTitle>
                    <CardDescription>Write a brief comment after reviewing the scores.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="teacher-comment">Teacher's Comment</Label>
                      <Textarea
                        id="teacher-comment"
                        placeholder="Write a brief comment about the student's performance"
                        value={teacherComment}
                        onChange={(e) => setTeacherComment(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" type="button" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading || !selectedClass || !selectedTerm || !selectedStatus}>
                    {isLoading ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Result
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </div>
      </main>
    </div>
  )
}
