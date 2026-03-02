"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { BarChart3, BookOpen, ChevronDown, Download, FileText, Home, LogOut, Menu, Settings, User } from "lucide-react"
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ParentDashboard() {
  const router = useRouter();
  const { signOut } = useClerk();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const { isLoaded, isSignedIn, user } = useUser()
  
  const [pupil, setPupil] = useState<any>(null)
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [linkPupilId, setLinkPupilId] = useState("")
  const [isLinking, setIsLinking] = useState(false)
  const [notLinked, setNotLinked] = useState(false)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/login")
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (user) {
        fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    setNotLinked(false)
    try {
      const email = user?.primaryEmailAddress?.emailAddress
      if (!email) return

      const res = await fetch(`/api/parent/dashboard?email=${email}`)
      if (res.ok) {
        const data = await res.json()
        if (data.notLinked) {
            setNotLinked(true)
        } else {
            setPupil(data.pupil)
            setResults(data.results || [])
        }
      } else {
          // If 404, maybe not linked
          setNotLinked(true)
      }
    } catch (e) {
      console.error("Failed to fetch dashboard data", e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLinkPupil = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!linkPupilId) return

    setIsLinking(true)
    try {
        const email = user?.primaryEmailAddress?.emailAddress
        const res = await fetch("/api/parent/dashboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pupilId: linkPupilId, email })
        })

        if (res.ok) {
            alert("Child linked successfully!")
            fetchDashboardData() // Refresh
        } else {
            const data = await res.json()
            alert(data.error || "Failed to link child")
        }
    } catch (e) {
        alert("Failed to link child. Please check connection.")
    } finally {
        setIsLinking(false)
    }
  }

  // Calculate stats from the latest result if available
  const latestResult = results.length > 0 ? results[0] : null
  const subjectsObj = latestResult && typeof latestResult.subjects === 'string' 
    ? JSON.parse(latestResult.subjects) 
    : (latestResult?.subjects || {})
    
  // Transform subjects object to array if needed for calculation
  const subjectKeys = Object.keys(subjectsObj)
  
  // Calculate average score
  // Assuming subjectsObj structure is { SubjectName: { midterm: "10", exam: "20" } }
  // We need to know how to calculate total from this structure if it matches the new DB format
  
  // Helper to parse score
  const getScore = (val: string) => Number(val) || 0
  
  const calculatedAverage = latestResult?.averageScore || 0

  // Count grades (if needed, but subjectKeys are strings now)
  // We can skip this or calculate if we parse scores fully
  const gradeCount: Record<string, number> = {} // Placeholder

  const handleLogout = () => {
    signOut(() => router.push("/login"));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/50">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (notLinked || !pupil) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50/50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Link Your Child</CardTitle>
                    <CardDescription>
                        Please enter your child's Pupil ID to access their dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLinkPupil} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="pupilId">Pupil ID</Label>
                            <Input 
                                id="pupilId" 
                                placeholder="e.g. BPS-001" 
                                value={linkPupilId}
                                onChange={(e) => setLinkPupilId(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLinking}>
                            {isLinking ? "Linking..." : "Link Child"}
                        </Button>
                    </form>
                    <div className="mt-4 pt-4 border-t text-center">
                        <Button onClick={handleLogout} variant="ghost" size="sm">
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
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
                href="/parent/dashboard"
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
                  href="/parent/dashboard"
                  className="flex items-center gap-2 text-primary"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/parent/results"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <FileText className="h-5 w-5" />
                  Results
                </Link>
                <Link
                  href="/parent/settings"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
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
              <span className="hidden md:inline-block">Parent Account</span>
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
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { signOut(() => { router.push("/login") }) }}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <div className="grid flex-1 md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r bg-muted/40 md:block">
          <nav className="grid gap-2 p-4 text-sm">
            <Link
              href="/parent/dashboard"
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/parent/results"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <FileText className="h-4 w-4" />
              Results
            </Link>
            <Link
              href="/parent/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </aside>
        <main className="flex flex-col gap-6 p-4 md:gap-8 md:p-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Pupil Dashboard</h1>
            <p className="text-muted-foreground">Welcome to the parent portal. View your child's academic progress.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pupil Name</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{pupil?.name}</div>
                <p className="text-xs text-muted-foreground">ID: {pupil?.id}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Class</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{pupil?.classId}</div>
                <p className="text-xs text-muted-foreground">{latestResult?.term || "Current Term"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{averageScore.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Grade:{" "}
                  {averageScore >= 70
                    ? "A"
                    : averageScore >= 60
                      ? "B"
                      : averageScore >= 50
                        ? "C"
                        : averageScore >= 40
                          ? "D"
                          : "F"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{subjects.length}</div>
                <p className="text-xs text-muted-foreground">
                  {gradeCount.A || 0} A's, {gradeCount.B || 0} B's, {gradeCount.C || 0} C's
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="current" className="space-y-4">
            <TabsList>
              <TabsTrigger value="current">Current Results</TabsTrigger>
              <TabsTrigger value="previous">Previous Terms</TabsTrigger>
            </TabsList>
            <TabsContent value="current" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Term Results</CardTitle>
                    <CardDescription>
                      {pupil?.classId} - {latestResult?.term || "N/A"}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
                      <div className="col-span-4">Subject</div>
                      <div className="col-span-2 text-center">Midterm</div>
                      <div className="col-span-2 text-center">Exam</div>
                      <div className="col-span-2 text-center">Total</div>
                      <div className="col-span-2 text-center">Grade</div>
                    </div>
                    <div className="divide-y">
                      {subjects.map((result: any) => (
                        <div key={result.subject} className="grid grid-cols-12 gap-2 p-4 items-center">
                          <div className="col-span-4">{result.subject}</div>
                          <div className="col-span-2 text-center">{result.midterm}</div>
                          <div className="col-span-2 text-center">{result.exam}</div>
                          <div className="col-span-2 text-center">{(result.total || 0).toFixed(1)}</div>
                          <div className="col-span-2 text-center">
                            <span
                              className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                result.grade === "A"
                                  ? "bg-green-100 text-green-800"
                                  : result.grade === "B"
                                    ? "bg-blue-100 text-blue-800"
                                    : result.grade === "C"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : result.grade === "D"
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-red-100 text-red-800"
                              }`}
                            >
                              {result.grade}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

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

                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Teacher's Comment</h4>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm">
                        {latestResult?.teacherComment || "No comment yet."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="previous" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Previous Term Results</CardTitle>
                  <CardDescription>View results from previous academic terms</CardDescription>
                </CardHeader>
                <CardContent>
                  {results.length > 1 ? (
                    <div className="space-y-4">
                      {results.slice(1).map((term: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                          <div>
                            <h4 className="font-medium">
                              {term.term} - {term.academicYear || "N/A"}
                            </h4>
                            <p className="text-sm text-muted-foreground">Average Score: {term.averageScore}%</p>
                            <p className="text-xs text-muted-foreground">Published: {new Date(term.createdAt).toLocaleDateString()}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">No Previous Results</h3>
                        <p className="text-sm text-muted-foreground">
                          Previous term results will appear here when available.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
