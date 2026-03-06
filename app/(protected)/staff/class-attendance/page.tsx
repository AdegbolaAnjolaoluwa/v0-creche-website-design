"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useClerk, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { ArrowLeft, Banknote, BookOpen, Check, ChevronDown, Clock, Home, LogOut, Menu, User, Users, X } from "lucide-react"

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
  const { user, isLoaded, isSignedIn } = useUser()
  const { signOut } = useClerk();
  const router = useRouter()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  
  const currentUser = useMemo(() => {
    if (!user) return null
    return {
      role: (user.publicMetadata.role as string) || "staff",
      email: user.primaryEmailAddress?.emailAddress,
      classId: (user.publicMetadata.classId as string)
    }
  }, [user])

  const [pupils, setPupils] = useState<any[]>([])
  const [todayStatuses, setTodayStatuses] = useState<Record<string, PupilAttendanceRecord["status"]>>({})
  const [isSavingAttendance, setIsSavingAttendance] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/login?type=staff")
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (currentUser?.classId) {
      fetchData()
    }
  }, [currentUser])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const today = formatDate(new Date())
      
      // Fetch pupils for the class
      const pupilsRes = await fetch(`/api/admin/pupils?classId=${currentUser?.classId}`)
      if (pupilsRes.ok) {
        const pupilsData = await pupilsRes.json()
        setPupils(pupilsData)
      }

      // Fetch today's attendance
      const attRes = await fetch(`/api/admin/attendance?classId=${currentUser?.classId}&date=${today}`)
      if (attRes.ok) {
        const attData = await attRes.json()
        const map: Record<string, PupilAttendanceRecord["status"]> = {}
        attData.forEach((record: any) => {
          map[record.studentId] = record.status
        })
        setTodayStatuses(map)
      }
    } catch (e) {
      console.error("Failed to fetch data", e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = (pupilId: string, status: PupilAttendanceRecord["status"]) => {
    setTodayStatuses((prev) => ({
      ...prev,
      [pupilId]: status,
    }))
  }

  const handleSaveAttendance = async () => {
    if (!currentUser?.classId) return
    setIsSavingAttendance(true)
    
    const today = formatDate(new Date())
    const promises = Object.entries(todayStatuses).map(async ([pupilId, status]) => {
      // Find pupil name
      const pupil = pupils.find(p => p.id === pupilId)
      
      return fetch("/api/admin/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: today,
          studentId: pupilId,
          studentName: pupil?.name || "Unknown",
          classId: currentUser.classId,
          status
        })
      })
    })

    try {
      await Promise.all(promises)
      alert("Attendance saved successfully!")
    } catch (e) {
      console.error("Failed to save attendance", e)
      alert("Failed to save attendance")
    } finally {
      setIsSavingAttendance(false)
    }
  }

  const handleLogout = () => { signOut(() => { router.push("/login?type=staff") }) }
  
  const today = formatDate(new Date())

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
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Clock className="h-5 w-5" />
                  My Attendance
                </Link>
                <Link
                  href="/staff/class-attendance"
                  className="flex items-center gap-2 text-primary"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Check className="h-5 w-5" />
                  Class Attendance
                </Link>
                <Link
                  href="/staff/daily-report"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <BookOpen className="h-5 w-5" />
                  Daily Report
                </Link>
                <Link
                  href="/staff/pupils"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  My Pupils
                </Link>
                <Link
                  href="/staff/loan"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Banknote className="h-5 w-5" />
                  Loan Request
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/staff/dashboard" className="mr-6 hidden md:flex">
          <Image
            src="/logo.jpg"
            alt="Bayhood Preparatory School logo"
            width={220}
            height={66}
            className="h-14 w-auto"
          />
        </Link>
        <nav className="hidden gap-6 text-sm font-medium md:flex">
          <Link href="/staff/dashboard" className="text-muted-foreground hover:text-foreground">
            Overview
          </Link>
          <Link href="/staff/my-attendance" className="text-muted-foreground hover:text-foreground">
            My Attendance
          </Link>
          <Link href="/staff/class-attendance" className="font-bold text-primary">
            Class Attendance
          </Link>
          <Link href="/staff/daily-report" className="text-muted-foreground hover:text-foreground">
            Daily Report
          </Link>
          <Link href="/staff/pupils" className="text-muted-foreground hover:text-foreground">
            My Pupils
          </Link>
          <Link href="/staff/loan" className="text-muted-foreground hover:text-foreground">
            Loan Request
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs text-muted-foreground">{currentUser?.email}</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <Link href="/staff/loan">
                <DropdownMenuItem>
                  <Banknote className="mr-2 h-4 w-4" />
                  <span>Loan Request</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
              <div className="text-xl font-bold">{currentUser?.classId || "No class"}</div>
              <p className="text-xs text-muted-foreground">
                Your currently assigned class
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pupils in Class</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{pupils.length}</div>
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
            {isLoading ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                Loading pupils...
              </div>
            ) : pupils.length === 0 ? (
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
                      {pupils.map((pupil) => {
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
                                  <Clock className="mr-1 h-4 w-4" />
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
                  <Button onClick={handleSaveAttendance} disabled={isSavingAttendance || pupils.length === 0}>
                    {isSavingAttendance ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      "Save Attendance"
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

