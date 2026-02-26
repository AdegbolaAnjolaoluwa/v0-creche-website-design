"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useParams } from "next/navigation"
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

import { pupilsData, type Pupil, classesData, resultsData, type ResultRecord, calculateAttendanceScore, calculateFinalScore } from "@/lib/data"

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

type PupilAttendanceRecord = {
  pupilId: string
  date: string
  status: "Present" | "Absent" | "Late"
}

const PUPIL_ATTENDANCE_KEY = "pupilAttendance"

export default function EditResult() {
  const router = useRouter()
  const params = useParams()
  const resultId = params.id as string
  
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  
  // State for the form
  const [pupilId, setPupilId] = useState("")
  const [pupilName, setPupilName] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedTerm, setSelectedTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [scores, setScores] = useState<Record<string, { midterm: string; exam: string }>>({})
  const [teacherComment, setTeacherComment] = useState("")
  const [proprietressComment, setProprietressComment] = useState("")

  const RESULTS_STORAGE_KEY = "adminResults"

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("currentUser")
    }
    router.push("/login?type=staff")
  }

  // Load User and Result
  useEffect(() => {
    if (typeof window === "undefined") return
    
    // 1. Check User
    const storedUser = window.localStorage.getItem("currentUser")
    if (!storedUser) {
      router.push("/login?type=admin")
      return
    }
    try {
      const parsed = JSON.parse(storedUser) as CurrentUser
      if (parsed.role !== "admin") {
        // Only admins can edit via this page
        router.push("/login?type=admin")
        return
      }
      setCurrentUser(parsed)
    } catch {
      router.push("/login?type=admin")
      return
    }

    // 2. Load Result
    const storedResults = window.localStorage.getItem(RESULTS_STORAGE_KEY)
    let allResults: ResultRecord[] = resultsData
    if (storedResults) {
      try {
        allResults = JSON.parse(storedResults)
      } catch {
        allResults = resultsData
      }
    }

    const result = allResults.find(r => r.id === resultId)
    if (!result) {
      // If result not found, go back
      router.push("/admin/results")
      return
    }

    // 3. Populate Form
    setPupilId(result.pupilId)
    setPupilName(result.pupilName)
    
    // Convert Label to Key for Class
    const classKey = result.class === "Creche" ? "creche" : 
                     result.class === "Nursery 1" ? "nursery-1" :
                     result.class === "Nursery 2" ? "nursery-2" : ""
    setSelectedClass(classKey)
    
    // Convert Label to Key for Term
    const termKey = result.term === "Term 1" ? "term-1" :
                    result.term === "Term 2" ? "term-2" :
                    result.term === "Term 3" ? "term-3" : ""
    setSelectedTerm(termKey)
    
    setSelectedStatus(result.status)
    setTeacherComment(result.teacherComment || "")
    setProprietressComment(result.proprietressComment || "")
    
    // Load scores if they exist, otherwise initialize empty
    if (result.scores) {
      setScores(result.scores)
    } else {
      const initialScores: Record<string, { midterm: string; exam: string }> = {}
      const classSubjects = subjects[classKey as keyof typeof subjects] ?? []
      classSubjects.forEach((subject) => {
        initialScores[subject] = { midterm: "", exam: "" }
      })
      setScores(initialScores)
    }

  }, [router, resultId])

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

        // Recalculate attendance (optional, but good to keep fresh)
        let attendancePercentage = 0
        if (pupilId) {
          const attendanceRaw = window.localStorage.getItem(PUPIL_ATTENDANCE_KEY)
          if (attendanceRaw) {
            try {
              const parsed = JSON.parse(attendanceRaw) as PupilAttendanceRecord[]
              const byDate = new Map<string, PupilAttendanceRecord["status"]>()
              parsed.forEach((record) => {
                if (record.pupilId !== pupilId) return
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

        // Create updated result object
        const updatedResult: ResultRecord = {
          id: resultId, // Keep existing ID
          pupilId,
          pupilName,
          class: mapClassKeyToLabel(selectedClass),
          term: mapTermKeyToLabel(selectedTerm),
          averageScore: roundedAverageScore,
          grade: getGrade(roundedAverageScore),
          date: new Date().toISOString().slice(0, 10), // Update date? Or keep original? Let's update to last edit.
          status: selectedStatus,
          proprietressComment: proprietressComment,
          attendancePercentage,
          attendanceScore,
          finalScore: Number(finalScore.toFixed(1)),
          scores,
          teacherComment,
        }

        // Replace the old result with the new one
        const updatedList = current.map(r => r.id === resultId ? updatedResult : r)
        window.localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(updatedList))
      }

      setIsLoading(false)
      router.push("/admin/results")
    }, 1500)
  }

  if (!currentUser) return null

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
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
              <span className="hidden md:inline-block">{currentUser?.email || "Admin Account"}</span>
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
              <Link href="/admin/results">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Edit Result</h1>
              <p className="text-muted-foreground">Update scores, comments, and status for {pupilName}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="scores" className="space-y-4">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="scores">Scores & Preview</TabsTrigger>
                <TabsTrigger value="pupil">Pupil Information</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pupil">
                 {/* Read-only pupil info for context */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Pupil Information</CardTitle>
                    <CardDescription>
                      Review details (Editing pupil info is restricted to ensure data integrity)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="pupil-id">Pupil ID</Label>
                        <Input id="pupil-id" value={pupilId} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pupil-name">Pupil Name</Label>
                        <Input id="pupil-name" value={pupilName} disabled />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                       <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                         <Input value={mapClassKeyToLabel(selectedClass)} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="term">Term</Label>
                         <Input value={mapTermKeyToLabel(selectedTerm)} disabled />
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
                              <SelectItem value="Pending Approval">Pending Approval</SelectItem>
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
                      <CardDescription>Update midterm and exam scores</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="scores" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="scores">Update Scores</TabsTrigger>
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
                              <p className="text-sm text-muted-foreground">Pupil Result Sheet</p>
                            </div>
                            <div className="p-4 border-b bg-muted/20">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">Pupil Name:</p>
                                  <p className="text-sm">{pupilName || "-"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Pupil ID:</p>
                                  <p className="text-sm">{pupilId || "-"}</p>
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
                              <div className="mt-4 p-4 border rounded-md bg-muted/10">
                                <h4 className="font-medium mb-2">Proprietress's Comment</h4>
                                <p className="text-sm whitespace-pre-line">
                                  {proprietressComment || "No comment provided."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Teacher's Comment</CardTitle>
                        <CardDescription>Review or update the teacher's comment.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                        <Label htmlFor="teacher-comment">Teacher's Comment</Label>
                        <Textarea
                            id="teacher-comment"
                            placeholder="Write a brief comment about the pupil's performance"
                            value={teacherComment}
                            onChange={(e) => setTeacherComment(e.target.value)}
                            rows={3}
                        />
                        </div>
                    </CardContent>
                    </Card>

                    <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Proprietress's Comment</CardTitle>
                        <CardDescription>Add or update the proprietress's comment.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                        <Label htmlFor="proprietress-comment">Proprietress's Comment</Label>
                        <Textarea
                            id="proprietress-comment"
                            placeholder="Write a comment from the proprietress"
                            value={proprietressComment}
                            onChange={(e) => setProprietressComment(e.target.value)}
                            rows={3}
                        />
                        </div>
                    </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" type="button" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading || !selectedClass || !selectedTerm || !selectedStatus}>
                    {isLoading ? (
                      "Updating..."
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Update Result
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