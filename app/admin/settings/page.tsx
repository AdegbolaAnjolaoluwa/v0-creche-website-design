"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, BookOpen, Calendar, ChevronDown, Home, Lock, Save, User, Users, ShieldCheck, Mail, Trash2, Edit2, Loader2, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useClerk } from "@clerk/nextjs"
import { classesData } from "@/lib/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const STAFF_ASSIGNMENTS_KEY = "staffClassAssignments"

type StaffAssignment = {
  name: string
  email: string
}

type UserType = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: string
  createdAt: number
  lastSignInAt: number | null
}

const currentYear = new Date().getFullYear()
// Show 2 years back and 5 years forward for a manageable dynamic list
const academicYears = Array.from({ length: 8 }, (_, i) => {
  const startYear = currentYear - 2 + i
  return `${startYear}-${startYear + 1}`
})

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { signOut } = useClerk()
  const [isLoading, setIsLoading] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("org:staff")
  const [isInviting, setIsInviting] = useState(false)

  // Users Management State
  const [users, setUsers] = useState<UserType[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  const [staffAssignments, setStaffAssignments] = useState<Record<string, StaffAssignment>>(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(STAFF_ASSIGNMENTS_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          // Migration: if it's still old string format, map it
          const migrated: Record<string, StaffAssignment> = {}
          Object.keys(parsed).forEach(key => {
            if (typeof parsed[key] === 'string') {
              migrated[key] = { name: "", email: parsed[key] }
            } else {
              migrated[key] = parsed[key]
            }
          })
          return migrated
        } catch {
          return {}
        }
      }
    }
    return {}
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoadingUsers(true)
    try {
      const res = await fetch("/api/admin/users")
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users)
      }
    } catch (e) {
      console.error("Failed to fetch users", e)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const handleDeleteUserById = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE"
      })

      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id))
        toast({
          title: "User Deleted",
          description: "The user has been permanently deleted."
        })
      } else {
        const err = await res.json()
        throw new Error(err.error || "Failed to delete")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleUpdateRole = async (id: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: id, role: newRole })
      })

      if (res.ok) {
        // Update local state to reflect change without full refetch
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u))
        toast({
          title: "Role Updated",
          description: "The user's role has been successfully changed."
        })
      } else {
        const err = await res.json()
        throw new Error(err.error || "Failed to update role")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleSave = () => {
    setIsLoading(true)
    // Save staff assignments to localStorage
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STAFF_ASSIGNMENTS_KEY, JSON.stringify(staffAssignments))
    }
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsInviting(true)

    try {
      const res = await fetch("/api/admin/invite-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to invite user")
      }

      let roleName = 'Parent'
      if (inviteRole === 'org:admin') roleName = 'Admin'
      else if (inviteRole === 'org:staff') roleName = 'Staff'

      toast({
        title: "Invitation Sent Successfully",
        description: `We've sent an email invitation to ${inviteEmail} to join as an ${roleName}.`,
      })
      setInviteEmail("")
      fetchUsers() // Refresh list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsInviting(false)
    }
  }

  const handleStaffChange = (classId: string, field: keyof StaffAssignment, value: string) => {
    setStaffAssignments(prev => ({
      ...prev,
      [classId]: {
        ...(prev[classId] || { name: "", email: "" }),
        [field]: value
      }
    }))
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
            <DropdownMenuItem className="bg-muted">Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              signOut(() => { router.push("/login") })
            }}>
              Log out
            </DropdownMenuItem>
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" x2="8" y1="13" y2="13"></line>
                <line x1="16" x2="8" y1="17" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Results
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
              href="/admin/pupils"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Users className="h-4 w-4" />
              Pupils
            </Link>
            <Link
              href="/admin/classes"
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
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
              </svg>
              Classes
            </Link>
            <Link
              href="/admin/settings"
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
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Settings
            </Link>
            <Link
              href="/admin/leave"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Calendar className="h-4 w-4" />
              Staff Leave
            </Link>
          </nav>
        </aside>
        <main className="flex flex-col gap-6 p-4 md:gap-8 md:p-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="staff">Staff Assignment</TabsTrigger>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="grading">Grading System</TabsTrigger>
            </TabsList>
            <TabsContent value="invitations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Invite Users</CardTitle>
                  <CardDescription>Create new accounts for staff, parents, or admins.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInviteUser} className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="grid gap-2 flex-1">
                      <Label htmlFor="invite-email">Email Address</Label>
                      <Input
                        id="invite-email"
                        type="email"
                        placeholder="user@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2 w-full sm:w-[200px]">
                      <Label htmlFor="invite-role">Role</Label>
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger id="invite-role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="org:admin">Admin</SelectItem>
                          <SelectItem value="org:staff">Staff</SelectItem>
                          <SelectItem value="org:parent">Parent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" disabled={isInviting}>
                      {isInviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                      {isInviting ? "Sending..." : "Invite"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View and manage all active users in the system.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={fetchUsers} disabled={isLoadingUsers}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingUsers ? (
                          <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                              <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                            </TableCell>
                          </TableRow>
                        ) : users.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                              No users found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'No Name'}
                                  </span>
                                  <span className="text-xs text-muted-foreground">{user.email}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 gap-1">
                                      <Badge variant={
                                        user.role === 'org:admin' ? 'default' :
                                          user.role === 'org:staff' ? 'secondary' : 'outline'
                                      } className="mr-1">
                                        {user.role.replace('org:', '').toUpperCase()}
                                      </Badge>
                                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start">
                                    <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleUpdateRole(user.id, 'org:admin')}>
                                      Admin
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleUpdateRole(user.id, 'org:staff')}>
                                      Staff
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleUpdateRole(user.id, 'org:parent')}>
                                      Parent
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  <span className="text-xs text-muted-foreground">
                                    Created: {new Date(user.createdAt).toLocaleDateString()}
                                  </span>
                                  {user.lastSignInAt && (
                                    <span className="text-xs text-green-600 flex items-center gap-1">
                                      <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                                      Active
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete User</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete <strong>{user.email}</strong>?
                                        This action cannot be undone and will permanently remove their access.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => {
                                          // We can't use state here directly if we want it to happen immediately
                                          // Or we can just call a function with the ID
                                          // But handleDeleteUser relies on state.
                                          // Let's create a temp function or just set state and use effect?
                                          // Easier: just pass ID to handleDeleteUser
                                          handleDeleteUserById(user.id)
                                        }}
                                        className="bg-destructive hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>School Information</CardTitle>
                  <CardDescription>Update your school's basic information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="school-name">School Name</Label>
                    <Input id="school-name" defaultValue="Bayhood Preparatory School" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      defaultValue="House 20, Road 18 Diamond Estate, Idimu, Lagos 100275"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue="(123) 456-7890" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="info@baythoodpreparatory.edu" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue="https://baythoodpreparatory.edu" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Academic Year</CardTitle>
                  <CardDescription>Configure the current academic year and terms</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="academic-year">Current Academic Year</Label>
                      <Select defaultValue={`${currentYear}-${currentYear + 1}`}>
                        <SelectTrigger id="academic-year">
                          <SelectValue placeholder="Select academic year" />
                        </SelectTrigger>
                        <SelectContent>
                          {academicYears.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="current-term">Current Term</Label>
                      <Select defaultValue="term-2">
                        <SelectTrigger id="current-term">
                          <SelectValue placeholder="Select current term" />
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
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="staff" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Staff Assignments</CardTitle>
                  <CardDescription>Assign a teacher to each class by their school email</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {classesData.map((cls) => (
                    <div key={cls.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b pb-6 last:border-0 last:pb-0">
                      <div className="md:col-span-3">
                        <Label className="text-sm font-semibold text-slate-700">{cls.name}</Label>
                        <p className="text-xs text-muted-foreground">{cls.ageRange}</p>
                      </div>
                      <div className="md:col-span-4 relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Teacher Name"
                          className="pl-10"
                          value={staffAssignments[cls.id]?.name || ""}
                          onChange={(e) => handleStaffChange(cls.id, "name", e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-5 relative">
                        <Bell className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="teacher@bayhood.com"
                          className="pl-10"
                          value={staffAssignments[cls.id]?.email || ""}
                          onChange={(e) => handleStaffChange(cls.id, "email", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Assignments"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>Password must be at least 8 characters</span>
                  </div>
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? (
                      <>Updating...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a code via SMS to verify your identity when signing in
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="grading" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Grading System</CardTitle>
                  <CardDescription>Configure the grading system for pupil assessments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Grade Scale</Label>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
                        <div className="col-span-2">Grade</div>
                        <div className="col-span-4">Score Range</div>
                        <div className="col-span-6">Description</div>
                      </div>
                      <div className="divide-y">
                        <div className="grid grid-cols-12 gap-2 p-4 items-center">
                          <div className="col-span-2">A</div>
                          <div className="col-span-4">70-100%</div>
                          <div className="col-span-6">Excellent</div>
                        </div>
                        <div className="grid grid-cols-12 gap-2 p-4 items-center">
                          <div className="col-span-2">B</div>
                          <div className="col-span-4">60-69%</div>
                          <div className="col-span-6">Very Good</div>
                        </div>
                        <div className="grid grid-cols-12 gap-2 p-4 items-center">
                          <div className="col-span-2">C</div>
                          <div className="col-span-4">50-59%</div>
                          <div className="col-span-6">Good</div>
                        </div>
                        <div className="grid grid-cols-12 gap-2 p-4 items-center">
                          <div className="col-span-2">D</div>
                          <div className="col-span-4">40-49%</div>
                          <div className="col-span-6">Fair</div>
                        </div>
                        <div className="grid grid-cols-12 gap-2 p-4 items-center">
                          <div className="col-span-2">F</div>
                          <div className="col-span-4">0-39%</div>
                          <div className="col-span-6">Needs Improvement</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Assessment Weightage</Label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="midterm-weight">Midterm Weight (%)</Label>
                        <Input id="midterm-weight" type="number" defaultValue="40" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exam-weight">Final Exam Weight (%)</Label>
                        <Input id="exam-weight" type="number" defaultValue="60" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
