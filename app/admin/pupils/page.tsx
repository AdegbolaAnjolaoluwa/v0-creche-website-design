"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { BookOpen, Calendar, ChevronDown, Download, Edit, Filter, Plus, Search, Trash, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { pupilsData, type Pupil, type Guardian } from "@/lib/data"

export { type Pupil, type Guardian }

const getAgeFromDateOfBirth = (dateOfBirth: string) => {
  if (!dateOfBirth) return "-"
  const dob = new Date(dateOfBirth)
  if (Number.isNaN(dob.getTime())) return "-"
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1
  }
  return age
}

export default function PupilsPage() {
  const searchParams = useSearchParams()
  const classFromQuery = searchParams.get("class")
  const initialSelectedClass = classFromQuery && classFromQuery.length > 0 ? classFromQuery : "all"

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState(initialSelectedClass)
  const [pupils, setPupils] = useState<Pupil[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    fetchPupils()
  }, [])

  const fetchPupils = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/pupils")
      if (res.ok) {
        const data = await res.json()
        const mapped = data.map((p: any) => ({
            ...p,
            class: p.classId,
            guardians: typeof p.guardians === 'string' ? JSON.parse(p.guardians) : p.guardians || []
        }))
        setPupils(mapped)
      }
    } catch (e) {
      console.error("Failed to fetch pupils", e)
    } finally {
      setIsLoading(false)
    }
  }
  const [isAddPupilOpen, setIsAddPupilOpen] = useState(false)
  const [newPupil, setNewPupil] = useState({
    name: "",
    class: "",
    dateOfBirth: "",
    gender: "",
    guardians: [{ name: "", contactNumber: "" }] as Guardian[],
  })
  const [isEditPupilOpen, setIsEditPupilOpen] = useState(false)
  const [editingPupilId, setEditingPupilId] = useState<string | null>(null)
  const [editPupil, setEditPupil] = useState({
    name: "",
    class: "",
    dateOfBirth: "",
    gender: "",
    guardians: [{ name: "", contactNumber: "" }] as Guardian[],
  })
  const [isDeletePupilOpen, setIsDeletePupilOpen] = useState(false)
  const [pupilToDelete, setPupilToDelete] = useState<{ id: string; name: string } | null>(null)

  // Filter pupils based on search and filters
  const filteredPupils = pupils.filter((pupil) => {
    if (!pupil) return false
    
    const term = (searchTerm || "").toLowerCase()
    const matchesSearch =
      (pupil.name || "").toLowerCase().includes(term) ||
      (pupil.id || "").toLowerCase().includes(term) ||
      (pupil.guardians || []).some(
        (guardian: Guardian) =>
          (guardian.name || "").toLowerCase().includes(term) ||
          (guardian.contactNumber || "").toLowerCase().includes(term),
      )

    const matchesClass = selectedClass === "all" || pupil.class === selectedClass

    return matchesSearch && matchesClass
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewPupil((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditPupil((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setNewPupil((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSelectChange = (name: string, value: string) => {
    setEditPupil((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch("/api/admin/pupils", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPupil.name,
          classId: newPupil.class,
          gender: newPupil.gender,
          dateOfBirth: newPupil.dateOfBirth,
          enrollmentDate: new Date().toISOString().split('T')[0],
          guardians: newPupil.guardians
        })
      })
      
      if (res.ok) {
        const data = await res.json()
        const created = {
          ...data.pupil,
          class: data.pupil.classId,
          guardians: JSON.parse(data.pupil.guardians)
        }
        setPupils((prev) => [...prev, created])
        setIsAddPupilOpen(false)
        setNewPupil({
          name: "",
          class: "",
          gender: "",
          dateOfBirth: "",
          guardians: [{ name: "", contactNumber: "" }],
        })
      }
    } catch (e) {
      console.error("Failed to create pupil", e)
    }
  }

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingPupilId) return
    setPupils((prev) =>
      prev.map((p) =>
        p.id === editingPupilId
          ? {
              ...p,
              name: editPupil.name,
              class: editPupil.class,
              gender: editPupil.gender,
              dateOfBirth: editPupil.dateOfBirth,
              guardians: editPupil.guardians.filter(
                (guardian: Guardian) => guardian.name || guardian.contactNumber,
              ),
            }
          : p,
      ),
    )
    setIsEditPupilOpen(false)
    setEditingPupilId(null)
    setEditPupil({
      name: "",
      class: "",
      gender: "",
      dateOfBirth: "",
      guardians: [{ name: "", contactNumber: "" }],
    })
  }

  const handleEditClick = (pupil: Pupil) => {
    setEditingPupilId(pupil.id)
    setEditPupil({
      name: pupil.name,
      class: pupil.class,
      gender: pupil.gender,
      dateOfBirth: pupil.dateOfBirth,
      guardians: pupil.guardians.length
        ? pupil.guardians.map((g) => ({ ...g }))
        : [
            {
              name: "",
              contactNumber: "",
            },
          ],
    })
    setIsEditPupilOpen(true)
  }

  const handleDeleteClick = (pupil: Pupil) => {
    setPupilToDelete({ id: pupil.id, name: pupil.name })
    setIsDeletePupilOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!pupilToDelete) return
    setPupils((prev) => prev.filter((pupil) => pupil.id !== pupilToDelete.id))
    setIsDeletePupilOpen(false)
    setPupilToDelete(null)
  }

  const handleCancelDelete = () => {
    setIsDeletePupilOpen(false)
    setPupilToDelete(null)
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
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
            >
              <User className="h-4 w-4" />
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
              href="/admin/attendance"
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
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
              </svg>
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
              href="/admin/loan"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Calendar className="h-4 w-4" />
              Staff Loan
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
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div className="grid gap-1">
              <h1 className="text-2xl font-bold tracking-tight">Pupils</h1>
              <p className="text-muted-foreground">Manage and view all enrolled pupils</p>
            </div>
            <div className="flex-1 grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:ml-auto">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Filter by class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="Creche">Creche</SelectItem>
                    <SelectItem value="Playgroup">Playgroup</SelectItem>
                    <SelectItem value="Preschool 1">Preschool 1</SelectItem>
                    <SelectItem value="Preschool 2">Preschool 2</SelectItem>
                    <SelectItem value="Nursery 1">Nursery 1</SelectItem>
                    <SelectItem value="Nursery 2">Nursery 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={isAddPupilOpen} onOpenChange={setIsAddPupilOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Pupil
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Pupil</DialogTitle>
                    <DialogDescription>Enter the pupil details to add a new enrollment</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Pupil Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={newPupil.name}
                            onChange={handleInputChange}
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="class">Class</Label>
                          <Select
                            value={newPupil.class}
                            onValueChange={(value) => handleSelectChange("class", value)}
                            required
                          >
                            <SelectTrigger id="class">
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Creche">Creche</SelectItem>
                              <SelectItem value="Playgroup">Playgroup</SelectItem>
                              <SelectItem value="Preschool 1">Preschool 1</SelectItem>
                              <SelectItem value="Preschool 2">Preschool 2</SelectItem>
                              <SelectItem value="Nursery 1">Nursery 1</SelectItem>
                              <SelectItem value="Nursery 2">Nursery 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of birth</Label>
                          <Input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            value={newPupil.dateOfBirth}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            value={newPupil.gender}
                            onValueChange={(value) => handleSelectChange("gender", value)}
                            required
                          >
                            <SelectTrigger id="gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Parent/Guardian details</Label>
                        <div className="space-y-3">
                          {newPupil.guardians.map((guardian: Guardian, index: number) => (
                            <div key={index} className="grid grid-cols-[1.5fr_1.5fr_auto] gap-2">
                              <Input
                                name="guardianName"
                                value={guardian.name}
                                onChange={(e) =>
                                  setNewPupil((prev) => {
                                    const next = [...prev.guardians]
                                    next[index] = { ...next[index], name: e.target.value }
                                    return { ...prev, guardians: next }
                                  })
                                }
                                placeholder={`Guardian ${index + 1} name`}
                              />
                              <Input
                                name="guardianContact"
                                value={guardian.contactNumber}
                                onChange={(e) =>
                                  setNewPupil((prev) => {
                                    const next = [...prev.guardians]
                                    next[index] = { ...next[index], contactNumber: e.target.value }
                                    return { ...prev, guardians: next }
                                  })
                                }
                                placeholder="Contact number"
                              />
                              <div className="flex items-center justify-end gap-2">
                                {newPupil.guardians.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      setNewPupil((prev) => ({
                                        ...prev,
                                        guardians: prev.guardians.filter((_, i) => i !== index),
                                      }))
                                    }
                                  >
                                    <Trash className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Maximum of 3 guardians.</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 px-2"
                              onClick={() =>
                                setNewPupil((prev) => ({
                                  ...prev,
                                  guardians: [...prev.guardians, { name: "", contactNumber: "" }],
                                }))
                              }
                              disabled={newPupil.guardians.length >= 3}
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              Add Guardian
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddPupilOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Pupil</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            <Dialog open={isEditPupilOpen} onOpenChange={setIsEditPupilOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Edit Pupil Details</DialogTitle>
                  <DialogDescription>Update information for {editPupil.name}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEditSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Pupil Name</Label>
                        <Input
                          id="edit-name"
                          name="name"
                          value={editPupil.name}
                          onChange={handleEditInputChange}
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-class">Class</Label>
                        <Select
                          value={editPupil.class}
                          onValueChange={(value) => handleEditSelectChange("class", value)}
                          required
                        >
                          <SelectTrigger id="edit-class">
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Creche">Creche</SelectItem>
                            <SelectItem value="Playgroup">Playgroup</SelectItem>
                            <SelectItem value="Preschool 1">Preschool 1</SelectItem>
                            <SelectItem value="Preschool 2">Preschool 2</SelectItem>
                            <SelectItem value="Nursery 1">Nursery 1</SelectItem>
                            <SelectItem value="Nursery 2">Nursery 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-dateOfBirth">Date of birth</Label>
                        <Input
                          id="edit-dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={editPupil.dateOfBirth}
                          onChange={handleEditInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-gender">Gender</Label>
                        <Select
                          value={editPupil.gender}
                          onValueChange={(value) => handleEditSelectChange("gender", value)}
                          required
                        >
                          <SelectTrigger id="edit-gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Parent/Guardian details</Label>
                      <div className="space-y-3">
                        {editPupil.guardians.map((guardian: Guardian, index: number) => (
                          <div key={index} className="grid grid-cols-[1.5fr_1.5fr_auto] gap-2">
                            <Input
                              name="guardianName"
                              value={guardian.name}
                              onChange={(e) =>
                                setEditPupil((prev) => {
                                  const next = [...prev.guardians]
                                  next[index] = { ...next[index], name: e.target.value }
                                  return { ...prev, guardians: next }
                                })
                              }
                              placeholder={`Guardian ${index + 1} name`}
                            />
                            <Input
                              name="guardianContact"
                              value={guardian.contactNumber}
                              onChange={(e) =>
                                setEditPupil((prev) => {
                                  const next = [...prev.guardians]
                                  next[index] = { ...next[index], contactNumber: e.target.value }
                                  return { ...prev, guardians: next }
                                })
                              }
                              placeholder="Contact number"
                            />
                            <div className="flex items-center justify-end gap-2">
                              {editPupil.guardians.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    setEditPupil((prev) => ({
                                      ...prev,
                                      guardians: prev.guardians.filter((_, i) => i !== index),
                                    }))
                                  }
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Maximum of 3 guardians.</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() =>
                              setEditPupil((prev) => ({
                                ...prev,
                                guardians: [...prev.guardians, { name: "", contactNumber: "" }],
                              }))
                            }
                            disabled={editPupil.guardians.length >= 3}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Add Guardian
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditPupilOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Update Pupil</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={isDeletePupilOpen} onOpenChange={setIsDeletePupilOpen}>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This will permanently delete the pupil record for {pupilToDelete?.name}. This action cannot be
                    undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCancelDelete}>
                    Cancel
                  </Button>
                  <Button type="button" variant="destructive" onClick={handleConfirmDelete}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </div>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="grid gap-1">
                <CardTitle>All Pupils</CardTitle>
                <CardDescription>{filteredPupils.length} pupils enrolled</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                <Download className="mr-2 h-4 w-4" />
                Export List
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No.</TableHead>
                      <TableHead>Pupil ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Parent/Guardian</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          Loading pupils...
                        </TableCell>
                      </TableRow>
                    ) : filteredPupils.length > 0 ? (
                      filteredPupils.map((pupil, index) => (
                        <TableRow key={pupil.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className="font-medium">{pupil.id}</TableCell>
                          <TableCell>
                            <Link href={`/admin/pupils/${pupil.id}`} className="hover:underline text-blue-600 font-medium">
                              {pupil.name}
                            </Link>
                          </TableCell>
                          <TableCell>{pupil.class}</TableCell>
                          <TableCell>{getAgeFromDateOfBirth(pupil.dateOfBirth)}</TableCell>
                          <TableCell>{pupil.gender}</TableCell>
                          <TableCell>{pupil.guardians.map((guardian: Guardian) => guardian.name).join(", ")}</TableCell>
                          <TableCell>{pupil.guardians.map((guardian: Guardian) => guardian.contactNumber).join(", ")}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="icon" onClick={() => handleEditClick(pupil)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-destructive"
                                onClick={() => handleDeleteClick(pupil)}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No pupils found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
