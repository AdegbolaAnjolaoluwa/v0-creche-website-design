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
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pupils</h1>
            <p className="text-muted-foreground">Manage and view all enrolled pupils</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or ID..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="hidden md:inline">Filter</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Class</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedClass("all")}>All Classes</DropdownMenuItem>
                {Array.from(new Set(pupils.map((p) => p.class))).map((className) => (
                  <DropdownMenuItem key={className} onClick={() => setSelectedClass(className)}>
                    {className}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setIsAddPupilOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">Add New Pupil</span>
            </Button>
          </div>
        </div>

        <Dialog open={isAddPupilOpen} onOpenChange={setIsAddPupilOpen}>
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

          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>All Pupils</CardTitle>
              <CardDescription>
                {filteredPupils.length} pupils enrolled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pupil ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead className="hidden md:table-cell">Guardian</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                     <TableRow>
                        <TableCell colSpan={8} className="text-center py-10">
                            Loading pupils...
                        </TableCell>
                     </TableRow>
                  ) : filteredPupils.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                            No pupils found.
                        </TableCell>
                    </TableRow>
                  ) : (
                    filteredPupils.map((pupil) => (
                    <TableRow key={pupil.id}>
                      <TableCell className="font-medium">{pupil.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{pupil.name}</div>
                      </TableCell>
                      <TableCell>{pupil.class}</TableCell>
                      <TableCell>{getAgeFromDateOfBirth(pupil.dateOfBirth)}</TableCell>
                      <TableCell>{pupil.gender}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {pupil.guardians && pupil.guardians[0]?.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {pupil.guardians && pupil.guardians[0]?.contactNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(pupil)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(pupil)}>
                            <Trash className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
      </main>
    </div>
  )
}
