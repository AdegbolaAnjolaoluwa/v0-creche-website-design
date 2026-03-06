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

  const [staffAssignments, setStaffAssignments] = useState<Record<string, StaffAssignment>>({})

  useEffect(() => {
    // Ideally fetch from DB here
    // For now, we will just use empty or mock if needed
    // In a real app: fetchStaffAssignments()
  }, [])

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

  const handleSave = async () => {
    setIsLoading(true)
    
    // Save staff assignments to localStorage (keep as backup/cache)
    // if (typeof window !== "undefined") {
    //   window.localStorage.setItem(STAFF_ASSIGNMENTS_KEY, JSON.stringify(staffAssignments))
    // }

    try {
      // Sync assignments to Clerk Metadata
      const updates = Object.entries(staffAssignments).map(async ([classId, assignment]) => {
        if (!assignment.email) return;
        
        // Find user by email
        const user = users.find(u => u.email.toLowerCase() === assignment.email.toLowerCase());
        if (user) {
          await fetch('/api/admin/users', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, classId: classId })
          });
        }
      });

      await Promise.all(updates);
      
      toast({
        title: "Settings Saved",
        description: "Staff assignments have been updated successfully."
      })
    } catch (error) {
      console.error("Failed to sync assignments", error);
      toast({
        title: "Error",
        description: "Failed to sync some assignments to the server.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false)
    }
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
    <div className="flex flex-col gap-6 p-4 md:gap-8 md:p-8">
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
    </div>
  )
}
