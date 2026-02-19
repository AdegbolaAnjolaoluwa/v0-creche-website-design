"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronDown, GraduationCap, Save, User } from "lucide-react"

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

// Sample subjects for different classes
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

export default function NewResult() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedTerm, setSelectedTerm] = useState("")
  const [scores, setScores] = useState<Record<string, { midterm: string; exam: string }>>({})

  // Handle class selection
  const handleClassChange = (value: string) => {
    setSelectedClass(value)

    // Initialize scores for the selected class subjects
    const initialScores: Record<string, { midterm: string; exam: string }> = {}
    subjects[value as keyof typeof subjects].forEach((subject) => {
      initialScores[subject] = { midterm: "", exam: "" }
    })
    setScores(initialScores)
  }

  // Handle score change
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

  // Calculate total and grade
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/admin/results")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-6 w-6" />
          <span className="hidden md:inline-block">Little Learners</span>
        </Link>
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
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin/dashboard">
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
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
                <CardDescription>Enter the student details and select the class and term</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="student-id">Student ID</Label>
                    <Input id="student-id" placeholder="Enter student ID" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-name">Student Name</Label>
                    <Input id="student-name" placeholder="Enter student name" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Select required onValueChange={handleClassChange}>
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
                    <Select required onValueChange={setSelectedTerm}>
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
                </div>
              </CardContent>
            </Card>

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
                        <div className="p-6 text-center border-b">
                          <h3 className="text-xl font-bold">Little Learners</h3>
                          <p className="text-sm text-muted-foreground">Student Result Sheet</p>
                        </div>
                        <div className="p-4 border-b bg-muted/20">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Student Name:</p>
                              <p className="text-sm">John Doe</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Student ID:</p>
                              <p className="text-sm">LL-2023-001</p>
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
                                {selectedTerm === "term-1" ? "Term 1" : selectedTerm === "term-2" ? "Term 2" : "Term 3"}
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
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !selectedClass || !selectedTerm}>
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
          </form>
        </div>
      </main>
    </div>
  )
}

