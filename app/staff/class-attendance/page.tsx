"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, Check, ChevronDown, Home, LogOut, Menu, User, Users, X } from "lucide-react"

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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { classesData, pupilsData } from "@/lib/data"

type CurrentUser = {
  role: string
  email?: string
  classId?: string
}

type PupilAttendanceRecord = {
  id: string
  pupilId: string
  classId: string
  staffEmail: string
  date: string
  time: string
  status: "Present" | "Absent" | "Late"
  createdAt: string
}

const PUPIL_ATTENDANCE_KEY = "pupilAttendance"

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function formatTime(date: Date) {
  return date.toTimeString().slice(0, 8)
}

export default function ClassAttendancePage() {
  const router = useRouter()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [pupilAttendance, setPupilAttendance] = useState<PupilAttendanceRecord[]>([])
  const [todayStatuses, setTodayStatuses] = useState<Record<string, PupilAttendanceRecord["status"]>>({})
  const [isSavingAttendance, setIsSavingAttendance] = useState(false)

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
    } catch {
      router.push("/login?type=staff")
    }
  }, [router])

  useEffect(() => {
    if (typeof window === "undefined") return
    const storedPupil = window.localStorage.getItem(PUPIL_ATTENDANCE_KEY)
    if (storedPupil) {
      try {
        const parsed = JSON.parse(storedPupil) as PupilAttendanceRecord[]
        setPupilAttendance(parsed)
      } catch {
        setPupilAttendance([])
      }
    }
  }, [])

  const assignedClass = useMemo(
    () => classesData.find((cls) => cls.id === currentUser?.classId),
    [currentUser?.classId],
  )

  const classPupils = useMemo(() => {
    if (!assignedClass) return []
    return pupilsData.filter((pupil) => pupil.class === assignedClass.name)
  }, [assignedClass])

  const today = formatDate(new Date())

  useEffect(() => {
    if (!currentUser) return
    const todaysRecords = pupilAttendance.filter(
      (record) => record.classId === currentUser.classId && record.date === today && record.staffEmail === currentUser.email,
    )
    const map: Record<string, PupilAttendanceRecord["status"]> = {}
    todaysRecords.forEach((record) => {
      map[record.pupilId] = record.status
    })
    setTodayStatuses(map)
  }, [currentUser, pupilAttendance, today])

  const recentPupilAttendance = useMemo(() => {
    if (!currentUser) return []
    const records = pupilAttendance
      .filter((record) => record.classId === currentUser.classId && record.staffEmail === currentUser.email)
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return records.slice(0, 20)
  }, [currentUser, pupilAttendance])

  const handleStatusChange = (pupilId: string, status: PupilAttendanceRecord["status"]) => {
    setTodayStatuses((prev) => ({
      ...prev,
      [pupilId]: status,
    }))
  }

  const handleSaveAttendance = () => {
    if (!currentUser) return
    if (typeof window === "undefined") return
    setIsSavingAttendance(true)
    const now = new Date()
    const date = formatDate(now)
    const time = formatTime(now)
    const createdAt = now.toISOString()
    const newRecords: PupilAttendanceRecord[] = []
    Object.entries(todayStatuses).forEach(([pupilId, status]) => {
      if (!status) return
      const record: PupilAttendanceRecord = {
        id: `${pupilId}-${createdAt}`,
        pupilId,
        classId: currentUser.classId || "",
        staffEmail: currentUser.email || "",
        date,
        time,
        status,
        createdAt,
      }
      newRecords.push(record)
    })
    if (newRecords.length === 0) {
      setIsSavingAttendance(false)
      return
    }
    const updated = [...pupilAttendance, ...newRecords]
    setPupilAttendance(updated)
    window.localStorage.setItem(PUPIL_ATTENDANCE_KEY, JSON.stringify(updated))
    setIsSavingAttendance(false)
  }

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("currentUser")
    }
    router.push("/login?type=staff")
  }

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
                href="/staff/dashboard"
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
                  href="/staff/dashboard"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  Overview
                </Link>
                <Link
                  href="/staff/my-attendance"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <User className="h-5 w-5" />
                  My Attendance
                </Link>
                <Link
                  href="/staff/class-attendance"
                  className="flex items-center gap-2 text-primary"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  Class Attendance
                </Link>
                <Link
                  href="/staff/daily-report"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <BookOpen className="h-5 w-5" />
                  Daily Report
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/staff/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Class Attendance</h1>
          </div>
          <p className="text-muted-foreground">
            Mark your class attendance for today and review recent records. Today is {today}.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Class</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{assignedClass?.name || "No class"}</div>
              <p className="text-xs text-muted-foreground">
                {assignedClass ? assignedClass.ageRange : "Set during login"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pupils in Class</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{classPupils.length}</div>
              <p className="text-xs text-muted-foreground">Pupils you can mark attendance for</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Class Attendance</CardTitle>
            <CardDescription>
              Mark each pupil as present, absent, or late for today.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {classPupils.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No pupils found for your assigned class.
              </div>
            ) : (
              <>
                <div className="max-h-[420px] overflow-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pupil</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead className="w-[260px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classPupils.map((pupil) => {
                        const status = todayStatuses[pupil.id]
                        return (
                          <TableRow key={pupil.id}>
                            <TableCell className="font-medium">{pupil.name}</TableCell>
                            <TableCell className="text-muted-foreground">{pupil.id}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant={status === "Present" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleStatusChange(pupil.id, "Present")}
                                >
                                  <Check className="mr-1 h-4 w-4" />
                                  Present
                                </Button>
                                <Button
                                  type="button"
                                  variant={status === "Absent" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleStatusChange(pupil.id, "Absent")}
                                >
                                  <X className="mr-1 h-4 w-4" />
                                  Absent
                                </Button>
                                <Button
                                  type="button"
                                  variant={status === "Late" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleStatusChange(pupil.id, "Late")}
                                >
                                  Late
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button type="button" onClick={handleSaveAttendance} disabled={isSavingAttendance}>
                    {isSavingAttendance ? "Saving..." : "Save Attendance"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Class Attendance</CardTitle>
            <CardDescription>Latest attendance you have recorded for this class.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentPupilAttendance.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No attendance records yet. Save attendance for your class to see it here.
              </div>
            ) : (
              <div className="max-h-[320px] overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pupil</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPupilAttendance.map((record) => {
                      const pupil = pupilsData.find((s) => s.id === record.pupilId)
                      return (
                        <TableRow key={record.id}>
                          <TableCell>{pupil?.name || "Unknown"}</TableCell>
                          <TableCell className="text-muted-foreground">{record.pupilId}</TableCell>
                          <TableCell>{record.status}</TableCell>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.time}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

