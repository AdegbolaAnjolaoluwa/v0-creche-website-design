"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, Plus, Trash, User, Users, Loader2 } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"

type ClassData = {
  id: string
  name: string
  description: string
  ageRange: string
  pupilCount: number
  teacherName?: string
  subjects?: string
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddClassOpen, setIsAddClassOpen] = useState(false)
  const [newClass, setNewClass] = useState({
    name: "",
    description: "",
    ageRange: "",
    teacherName: "",
    subjects: "",
  })

  const [staffAssignments, setStaffAssignments] = useState<Record<string, { name: string, email: string }>>({})

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/admin/classes")
      if (res.ok) {
        const data = await res.json()
        setClasses(data)
      }
    } catch (e) {
      console.error("Failed to fetch classes", e)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewClass((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/admin/classes', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClass) 
      })
      
      if (res.ok) {
        const created = await res.json()
        setClasses(prev => [...prev, created])
        setIsAddClassOpen(false)
        // Reset form
        setNewClass({
          name: "",
          description: "",
          ageRange: "",
          teacherName: "",
          subjects: "",
        })
      }
    } catch (e) {
      console.error("Failed to create class", e)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">Manage classes, teachers, and subjects</p>
        </div>
        <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
              <DialogDescription>Create a new class and assign a teacher.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Class Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={newClass.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Nursery 1"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ageRange" className="text-right">
                  Age Range
                </Label>
                <Input
                  id="ageRange"
                  name="ageRange"
                  value={newClass.ageRange}
                  onChange={handleInputChange}
                  placeholder="e.g. 2-3 years"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="teacherName" className="text-right">
                  Teacher
                </Label>
                <Input
                  id="teacherName"
                  name="teacherName"
                  value={newClass.teacherName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newClass.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subjects" className="text-right">
                  Subjects
                </Label>
                <Input
                  id="subjects"
                  name="subjects"
                  value={newClass.subjects}
                  onChange={handleInputChange}
                  placeholder="Comma separated subjects"
                  className="col-span-3"
                />
              </div>
              <DialogFooter>
                <Button type="submit">Create Class</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : classes.map((classItem) => (
          <Card key={classItem.id} className="overflow-hidden">
            <CardHeader className="border-b bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{classItem.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <span className="sr-only">Open menu</span>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                    <DropdownMenuItem>Assign Teacher</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Class
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{classItem.ageRange}</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid gap-4">
                <p className="text-sm text-muted-foreground">{classItem.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{classItem.pupilCount}</span> Pupils
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {staffAssignments[classItem.id]?.name || classItem.teacherName || "Unassigned"}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Subjects</h4>
                  <div className="flex flex-wrap gap-1">
                    {classItem.subjects && typeof classItem.subjects === 'string' ? (
                      (() => {
                        try {
                          const parsed = JSON.parse(classItem.subjects);
                          return Array.isArray(parsed) ? parsed.map((subject: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            >
                              {subject}
                            </span>
                          )) : <span className="text-xs text-muted-foreground">{classItem.subjects}</span>
                        } catch (e) {
                          // Fallback if not JSON
                          return classItem.subjects.split(',').map((subject: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            >
                              {subject.trim()}
                            </span>
                          ))
                        }
                      })()
                    ) : (
                       <span className="text-xs text-muted-foreground">No subjects listed</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
