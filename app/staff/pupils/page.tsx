"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronDown, LogOut, User, Search, Phone } from "lucide-react"

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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { pupilsData, type Pupil, classesData } from "@/lib/data"

type CurrentUser = {
  role: string
  email?: string
  classId?: string
}

export default function StaffPupilsPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [classPupils, setClassPupils] = useState<Pupil[]>([])
  const [className, setClassName] = useState("")

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
      
      const assignedClass = classesData.find(cls => cls.id === parsed.classId)
      if (assignedClass) {
        setClassName(assignedClass.name)
        const pupils = pupilsData.filter(p => p.class === assignedClass.name)
        setClassPupils(pupils)
      }
    } catch {
      router.push("/login?type=staff")
    }
  }, [router])

  const filteredPupils = classPupils.filter(pupil => 
    pupil.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pupil.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("currentUser")
    }
    router.push("/login?type=staff")
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
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
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/staff/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Pupils</h1>
            <p className="text-muted-foreground">Managing students in {className}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search pupils..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Class List</CardTitle>
            <CardDescription>
              Total of {classPupils.length} pupils enrolled in your class.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPupils.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pupils found matching your search.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Guardians</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPupils.map((pupil) => (
                    <TableRow key={pupil.id}>
                      <TableCell className="font-medium text-muted-foreground">{pupil.id}</TableCell>
                      <TableCell className="font-medium">{pupil.name}</TableCell>
                      <TableCell>{pupil.gender}</TableCell>
                      <TableCell>
                        {/* Simple age calculation logic reused */}
                        {(() => {
                            if (!pupil.dateOfBirth) return "-"
                            const dob = new Date(pupil.dateOfBirth)
                            const today = new Date()
                            let age = today.getFullYear() - dob.getFullYear()
                            const m = today.getMonth() - dob.getMonth()
                            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                                age--
                            }
                            return age
                        })()}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          {pupil.guardians.map((g, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span>{g.name}</span>
                              <span className="text-muted-foreground text-xs flex items-center gap-1">
                                <Phone className="h-3 w-3" /> {g.contactNumber}
                              </span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}