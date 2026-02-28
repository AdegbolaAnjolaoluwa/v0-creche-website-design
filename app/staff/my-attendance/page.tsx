"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useClerk, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { ArrowLeft, Banknote, BarChart3, BookOpen, ChevronDown, Home, LogOut, Menu, User, Users } from "lucide-react"

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
import { classesData } from "@/lib/data"

type CurrentUser = {
  role: string
  email?: string
  classId?: string
}

type StaffAttendanceRecord = {
  id: string
  staffEmail: string
  date: string
  time: string
  createdAt: string
}

const STAFF_ATTENDANCE_KEY = "staffAttendance"

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function formatTime(date: Date) {
  return date.toTimeString().slice(0, 8)
}

function isAfterSignInCutoff() {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  if (hours > 7) return true
  if (hours < 7) return false
  return minutes >= 45
}

export default function MyAttendancePage() {
  const { signOut } = useClerk();
  const { user, isLoaded, isSignedIn } = useUser()
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

  const [staffAttendance, setStaffAttendance] = useState<StaffAttendanceRecord[]>([])
  const [isSigningIn, setIsSigningIn] = useState(false)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/login?type=staff")
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (typeof window === "undefined") return
    const storedStaff = window.localStorage.getItem(STAFF_ATTENDANCE_KEY)
    if (storedStaff) {
      try {
        const parsed = JSON.parse(storedStaff) as StaffAttendanceRecord[]
        setStaffAttendance(parsed)
      } catch {
        setStaffAttendance([])
      }
    }
  }, [])

  const assignedClass = useMemo(
    () => classesData.find((cls) => cls.id === currentUser?.classId),
    [currentUser?.classId],
  )

  const today = formatDate(new Date())

  const todayStaffAttendance = useMemo(() => {
    if (!currentUser) return []
    return staffAttendance.filter((record) => record.staffEmail === currentUser.email && record.date === today)
  }, [currentUser, staffAttendance, today])

  const hasSignedInToday = todayStaffAttendance.length > 0
  const isSignInClosed = isAfterSignInCutoff()

  const recentStaffAttendance = useMemo(() => {
    if (!currentUser) return []
    const records = staffAttendance
      .filter((record) => record.staffEmail === currentUser.email)
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return records.slice(0, 20)
  }, [currentUser, staffAttendance])

  const handleStaffSignIn = () => {
    if (!currentUser) return
    if (typeof window === "undefined") return
    if (isAfterSignInCutoff()) return
    const alreadySignedIn = staffAttendance.some(
      (record) => record.staffEmail === currentUser.email && record.date === today,
    )
    if (alreadySignedIn) return
    setIsSigningIn(true)
    const now = new Date()
    const date = formatDate(now)
    const time = formatTime(now)
    const createdAt = now.toISOString()
    const record: StaffAttendanceRecord = {
      id: `${currentUser.email}-${createdAt}`,
      staffEmail: currentUser.email || "",
      date,
      time,
      createdAt,
    }
    const updated = [...staffAttendance, record]
    setStaffAttendance(updated)
    window.localStorage.setItem(STAFF_ATTENDANCE_KEY, JSON.stringify(updated))
    setIsSigningIn(false)
  }

  const handleLogout = () => { signOut(() => { router.push("/login?type=staff") }) }

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
                  className="flex items-center gap-2 text-primary"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <User className="h-5 w-5" />
                  My Attendance
                </Link>
                <Link
                  href="/staff/class-attendance"
                  className="flex items-center gap-2"
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
                <Link
                  href="/staff/loan"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Banknote className="h-5 w-5" />
                  Loan Request
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
            <h1 className="text-2xl font-bold tracking-tight">My Attendance</h1>
          </div>
          <p className="text-muted-foreground">
            Record and review your daily sign-ins. Today is {today}.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff Email</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{currentUser?.email || "Not set"}</div>
            </CardContent>
          </Card>
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
              <CardTitle className="text-sm font-medium">Sign-Ins Today</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{todayStaffAttendance.length}</div>
              <p className="text-xs text-muted-foreground">
                {hasSignedInToday
                  ? "You have signed in for today."
                  : isSignInClosed
                    ? "Sign in closed. You are late for today."
                    : "No sign-in recorded yet for today."}
              </p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Record Today&apos;s Sign-In</CardTitle>
              <CardDescription>Time is captured automatically when you sign in.</CardDescription>
            </div>
            <Button onClick={handleStaffSignIn} disabled={isSigningIn || hasSignedInToday || isSignInClosed}>
              {hasSignedInToday
                ? "Already signed in"
                : isSignInClosed
                  ? "Sign in closed"
                  : isSigningIn
                    ? "Signing in..."
                    : "Sign In"}
            </Button>
          </CardHeader>
          <CardContent>
            {todayStaffAttendance.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No sign-ins recorded for today yet. Press Sign In to record now.
              </div>
            ) : (
              <div className="max-h-60 overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todayStaffAttendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Sign-Ins</CardTitle>
            <CardDescription>History of your latest sign-ins.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentStaffAttendance.length === 0 ? (
              <div className="text-sm text-muted-foreground">No sign-ins recorded yet.</div>
            ) : (
              <div className="max-h-[320px] overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentStaffAttendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.time}</TableCell>
                      </TableRow>
                    ))}
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
