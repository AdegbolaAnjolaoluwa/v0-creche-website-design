import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { BookOpen, Calendar, ChevronDown, User, Users } from "lucide-react"

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

const classesData = [
  {
    id: "class-001",
    name: "Creche",
    description:
      "For children aged 3 months to 2 years. Focused on nurturing care, sensory play, and early development milestones.",
    ageRange: "3 months - 2 years",
    teacherName: "Alexander Anwangbasi Joy",
    pupilCount: 18,
    subjects: ["Motor Skills", "Social Interaction", "Basic Recognition", "Sensory Development"],
  },
  {
    id: "class-002",
    name: "Nursery 1",
    description:
      "For children aged 2-3 years. Introducing structured learning through play, basic concepts, and social skills.",
    ageRange: "2-3 years",
    teacherName: "Adegoke Oluwatosin Elizabeth",
    pupilCount: 28,
    subjects: ["Alphabets", "Numbers", "Coloring", "Rhymes", "Basic Writing", "Social Skills"],
  },
  {
    id: "class-003",
    name: "Nursery 2",
    description:
      "For children aged 3-4 years. Building pre-academic foundations, language development, and creative expression.",
    ageRange: "3-4 years",
    teacherName: "Teniola Fetinoluwa Christiana",
    pupilCount: 32,
    subjects: [
      "Reading",
      "Writing",
      "Arithmetic",
      "Arts & Crafts",
      "Science",
      "Social Studies",
      "Physical Education",
      "Music",
    ],
  },
  {
    id: "class-004",
    name: "Playgroup",
    description:
      "An introductory program that helps children adjust to school routines through guided play and social interaction.",
    ageRange: "18 months - 3 years",
    teacherName: "Fagade Samuel",
    pupilCount: 16,
    subjects: ["Free Play", "Circle Time", "Music & Movement", "Outdoor Play"],
  },
  {
    id: "class-005",
    name: "Preschool 1",
    description:
      "For children progressing from playgroup. Focused on language development, number sense, and social confidence.",
    ageRange: "3-4 years",
    teacherName: "Akinnade Oluwafemi",
    pupilCount: 20,
    subjects: ["Pre-reading", "Pre-writing", "Numbers", "Practical Life", "Rhymes", "Story Time"],
  },
  {
    id: "class-006",
    name: "Preschool 2",
    description:
      "For children preparing to enter Nursery 1. Reinforces pre-academic skills, independence, and classroom routines.",
    ageRange: "4-5 years",
    teacherName: "Damisa Yetunde Halimat",
    pupilCount: 22,
    subjects: ["Reading Readiness", "Writing Readiness", "Mathematics Concepts", "Science Exploration", "Art & Music"],
  },
]

type ClassDetailPageProps = {
  params: {
    id: string
  }
}

export default function ClassDetailPage({ params }: ClassDetailPageProps) {
  const classItem = classesData.find((item) => item.id === params.id)
  const [assignedTeacher, setAssignedTeacher] = useState<{ name: string, email: string } | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("staffClassAssignments")
      if (stored && classItem) {
        const assignments = JSON.parse(stored)
        if (assignments[classItem.id]) {
          const assignment = assignments[classItem.id]
          if (typeof assignment === 'string') {
            setAssignedTeacher({ name: "", email: assignment })
          } else {
            setAssignedTeacher(assignment)
          }
        }
      }
    }
  }, [classItem])

  if (!classItem) {
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
        </header>
        <main className="flex flex-1 items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Class not found</CardTitle>
              <CardDescription>The requested class does not exist.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Button asChild variant="outline">
                <Link href="/admin/classes">Back to Classes</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
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
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
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
                <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H19"></path>
                <path d="M20 8c0-1.1-.9-2-2-2h-5"></path>
                <path d="M4 4v16"></path>
                <path d="M8 4h9"></path>
                <path d="M9 8h6"></path>
              </svg>
              Classes
            </Link>
            <Link
              href="/admin/attendance"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Calendar className="h-4 w-4" />
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
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">{classItem.name}</h1>
              <p className="text-muted-foreground">{classItem.ageRange}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/admin/classes">Back to Classes</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/admin/pupils?class=${encodeURIComponent(classItem.name)}`}>View Pupils</Link>
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Class Information</CardTitle>
              <CardDescription>Overview of the class, teacher, and subjects.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{classItem.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  {assignedTeacher ? (
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{assignedTeacher.name || "Unnamed Teacher"}</span>
                      <span className="text-xs text-muted-foreground">{assignedTeacher.email}</span>
                    </div>
                  ) : (
                    <p>{classItem.teacherName}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{classItem.pupilCount} pupils enrolled</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {classItem.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

