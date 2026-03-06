"use client"

import type React from "react"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { useClerk, useUser } from "@clerk/nextjs"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import { pupilsData, type Pupil, classesData, calculateAttendanceScore, calculateFinalScore } from "@/lib/data"

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

export default function NewResult() {
  const { signOut } = useClerk();
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  const isStaff = pathname?.startsWith("/staff")
  const expectedRole = isStaff ? "staff" : "admin"
  
  const currentUser = useMemo(() => {
    if (!user) return null
    return {
      role: (user.publicMetadata.role as string) || expectedRole,
      email: user.primaryEmailAddress?.emailAddress,
      classId: (user.publicMetadata.classId as string)
    }
  }, [user, expectedRole])

  const [assignedClassName, setAssignedClassName] = useState<string | null>(null)
  const [pupilId, setPupilId] = useState("")
  const [pupilName, setPupilName] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedTerm, setSelectedTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [scores, setScores] = useState<Record<string, { midterm: string; exam: string }>>({})
  const [teacherComment, setTeacherComment] = useState("")
  const [proprietressComment, setProprietressComment] = useState("")

  const handleLogout = () => { signOut(() => { router.push(`/login?type=${expectedRole}`) }) }

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push(`/login?type=${expectedRole}`)
      return
    }

    if (isStaff && currentUser?.classId) {
      const cls = classesData.find(c => c.id === currentUser.classId)
      if (cls) {
        setAssignedClassName(cls.name)
        // Auto-select class for staff
        const key = Object.keys(subjects).find(k => {
            return cls.name.toLowerCase().includes(k) || k.includes("creche") // Fallback
        })
        setSelectedClass(cls.name) // If the UI uses this
      }
    }
  }, [isLoaded, isSignedIn, router, expectedRole, isStaff, currentUser])

  const mapPupilClassToKey = (className: string) => {
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

  const findPupil = (value: string): Pupil | undefined => {
    const trimmed = value.trim()
    if (!trimmed) return undefined
    const lower = trimmed.toLowerCase()
    const allowedPupils =
      assignedClassName != null ? pupilsData.filter((pupil) => pupil.class === assignedClassName) : pupilsData
    return (
      allowedPupils.find((pupil) => pupil.id.toLowerCase() === lower) ||
      allowedPupils.find((pupil) => pupil.name.toLowerCase() === lower)
    )
  }

  const handlePupilMatch = (pupil: Pupil | undefined) => {
    if (!pupil) return
    setPupilId(pupil.id)
    setPupilName(pupil.name)
    const classKey = mapPupilClassToKey(pupil.class)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
        if (!currentUser) {
          setIsLoading(false)
          router.push("/login")
          return
        }

        const classSubjects = subjects[selectedClass as keyof typeof subjects] ?? []
        const totals = classSubjects.map((subject) => calculateTotal(subject))
        const averageScore =
          classSubjects.length > 0
            ? totals.reduce((sum, value) => sum + value, 0) / classSubjects.length
            : 0

        const roundedAverageScore = Number(averageScore.toFixed(1))

        const attendancePercentage = 0 
        const attendanceScore = calculateAttendanceScore(attendancePercentage)
        // const finalScore = calculateFinalScore(roundedAverageScore, attendanceScore) // Unused variable

        const payload = {
          studentId: pupilId,
          studentName: pupilName,
          classId: mapClassKeyToLabel(selectedClass),
          term: mapTermKeyToLabel(selectedTerm),
          academicYear: "2023-2024", // Should be dynamic
          subjects: JSON.stringify(scores),
          totalScore: Math.round(averageScore * classSubjects.length), // Approx total
          averageScore: roundedAverageScore,
          grade: getGrade(roundedAverageScore),
          teacherComment,
          headTeacherComment: currentUser.role === "org:admin" ? proprietressComment : undefined,
          status: currentUser.role === "org:admin" ? (selectedStatus || "Draft") : "Pending Approval",
        }

        const res = await fetch("/api/admin/results", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })

        if (res.ok) {
            router.push(isStaff ? "/staff/results" : "/admin/results")
        } else {
            console.error("Failed to create result")
            setIsLoading(false)
        }
    } catch (e) {
        console.error("Error creating result", e)
        setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:gap-8 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" asChild>
              <Link href={(pathname || "").startsWith("/staff") ? "/staff/dashboard" : "/admin/results"}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Add New Result</h1>
              <p className="text-muted-foreground">Enter pupil details and scores to generate a result</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="pupil" className="space-y-4">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="pupil">Pupil Information</TabsTrigger>
                <TabsTrigger value="scores">Scores & Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="pupil">
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Pupil Information</CardTitle>
                    <CardDescription>
                      Enter the pupil details, select the class and term, and add comments
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="pupil-id">Pupil ID</Label>
                        <Input
                          id="pupil-id"
                          placeholder="Enter pupil ID"
                          value={pupilId}
                          onChange={(e) => {
                            const value = e.target.value
                            setPupilId(value)
                            const match = findPupil(value)
                            if (match) {
                              handlePupilMatch(match)
                            }
                          }}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pupil-name">Pupil Name</Label>
                        <Input
                          id="pupil-name"
                          placeholder="Enter pupil name"
                          value={pupilName}
                          onChange={(e) => {
                            const value = e.target.value
                            setPupilName(value)
                            const match = findPupil(value)
                            if (match) {
                              handlePupilMatch(match)
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
                      {currentUser?.role === "admin" && (
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
                      )}
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
                        placeholder="Write a brief comment about the pupil's performance"
                        value={teacherComment}
                        onChange={(e) => setTeacherComment(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
                {currentUser?.role === "admin" && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Proprietress's Comment</CardTitle>
                      <CardDescription>Add a comment from the school proprietress.</CardDescription>
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
                )}
                <div className="flex justify-end gap-4">
                  <Button variant="outline" type="button" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading || !selectedClass || !selectedTerm || (currentUser?.role === 'admin' && !selectedStatus)}>
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
    </div>
  )
}