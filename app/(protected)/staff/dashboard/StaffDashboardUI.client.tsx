"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Home, Users, BookOpen, Check, X, LogOut, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function StaffDashboardUI({ initialData, classId }: { initialData: any, classId: string }) {
  const router = useRouter()
  const { signOut } = useClerk()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const { attendanceMarked, pupilCount, pendingLoans, recentReports, className } = initialData

  const handleLogout = () => { signOut(() => { router.push("/login") }) }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
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
                  width={180}
                  height={54}
                  className="h-14 w-auto"
                />
              </Link>
              <Link
                href="/staff/dashboard"
                className="flex items-center gap-4 px-2.5 text-foreground"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/staff/pupils"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <Users className="h-5 w-5" />
                My Pupils
              </Link>
              <Link
                href="/staff/class-attendance"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <BookOpen className="h-5 w-5" />
                Class Attendance
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial">
            <h1 className="text-xl font-bold text-primary hidden md:block">Staff Portal</h1>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back!</h1>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Class</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{className}</div>
              <p className="text-xs text-muted-foreground">{pupilCount} pupils enrolled</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {attendanceMarked ? (
                  <span className="text-green-600 flex items-center gap-2">
                    Marked <Check className="h-4 w-4" />
                  </span>
                ) : (
                  <span className="text-amber-600 flex items-center gap-2">
                    Pending <X className="h-4 w-4" />
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {attendanceMarked ? "Great job!" : "Please mark attendance"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Recent Daily Reports</CardTitle>
                <CardDescription>Reports submitted for your class.</CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/staff/daily-report">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
                {recentReports.length === 0 ? (
                    <p className="text-muted-foreground">No reports submitted recently.</p>
                ) : (
                    <ul className="space-y-4">
                        {recentReports.map((report: any) => (
                            <li key={report.id} className="border-b pb-4 last:border-0">
                                <div className="font-medium">{report.date}</div>
                                <div className="text-sm text-muted-foreground truncate max-w-md">
                                    {typeof report.content === 'string' ? JSON.parse(report.content).topicsTaught : report.content.topicsTaught}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
