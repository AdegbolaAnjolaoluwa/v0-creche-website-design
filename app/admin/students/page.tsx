"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ChevronDown, Download, Edit, Filter, Plus, Search, Trash, User } from "lucide-react"

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

export type Guardian = {
  name: string
  contactNumber: string
}

export type Student = {
  id: string
  name: string
  class: string
  gender: string
  dateOfBirth: string
  guardians: Guardian[]
  enrollmentDate: string
}

export const studentsData: Student[] = [
  // Nursery 2
  {
    id: "BH-N2-001",
    name: "Agboola Jasmine",
    class: "Nursery 2",
    gender: "Female",
    dateOfBirth: "2020-05-12",
    guardians: [{ name: "Mr. and Mrs. Agboola", contactNumber: "+2348000000001" }],
    enrollmentDate: "2023-09-05",
  },
  {
    id: "BH-N2-002",
    name: "Ewuzie Angela",
    class: "Nursery 2",
    gender: "Female",
    dateOfBirth: "2020-08-21",
    guardians: [{ name: "Mr. and Mrs. Ewuzie", contactNumber: "+2348000000002" }],
    enrollmentDate: "2023-09-05",
  },
  {
    id: "BH-N2-003",
    name: "Chimezie Dominion",
    class: "Nursery 2",
    gender: "Male",
    dateOfBirth: "2020-02-18",
    guardians: [{ name: "Mr. and Mrs. Chimezie", contactNumber: "+2348000000003" }],
    enrollmentDate: "2023-09-06",
  },
  {
    id: "BH-N2-004",
    name: "Inegbeneoe Gerald",
    class: "Nursery 2",
    gender: "Male",
    dateOfBirth: "2019-11-03",
    guardians: [{ name: "Mr. and Mrs. Inegbeneoe", contactNumber: "+2348000000004" }],
    enrollmentDate: "2023-09-06",
  },
  {
    id: "BH-N2-005",
    name: "Kazeem Imide",
    class: "Nursery 2",
    gender: "Male",
    dateOfBirth: "2020-01-27",
    guardians: [{ name: "Mr. and Mrs. Kazeem", contactNumber: "+2348000000005" }],
    enrollmentDate: "2023-09-07",
  },
  {
    id: "BH-N2-006",
    name: "Fakude Mabel",
    class: "Nursery 2",
    gender: "Female",
    dateOfBirth: "2020-06-14",
    guardians: [{ name: "Mr. and Mrs. Fakude", contactNumber: "+2348000000006" }],
    enrollmentDate: "2023-09-07",
  },
  // Nursery 1
  {
    id: "BH-N1-001",
    name: "Adebayo Ayomide",
    class: "Nursery 1",
    gender: "Female",
    dateOfBirth: "2021-03-10",
    guardians: [{ name: "Mr. and Mrs. Adebayo", contactNumber: "+2348000000007" }],
    enrollmentDate: "2023-09-08",
  },
  {
    id: "BH-N1-002",
    name: "Adedoyin Judith",
    class: "Nursery 1",
    gender: "Female",
    dateOfBirth: "2021-07-19",
    guardians: [{ name: "Mr. and Mrs. Adedoyin", contactNumber: "+2348000000008" }],
    enrollmentDate: "2023-09-08",
  },
  {
    id: "BH-N1-003",
    name: "Adeshida Fiyin",
    class: "Nursery 1",
    gender: "Female",
    dateOfBirth: "2021-01-05",
    guardians: [{ name: "Mr. and Mrs. Adeshida", contactNumber: "+2348000000009" }],
    enrollmentDate: "2023-09-09",
  },
  {
    id: "BH-N1-004",
    name: "Emokpea Louisa",
    class: "Nursery 1",
    gender: "Female",
    dateOfBirth: "2021-09-23",
    guardians: [{ name: "Mr. and Mrs. Emokpea", contactNumber: "+2348000000010" }],
    enrollmentDate: "2023-09-09",
  },
  {
    id: "BH-N1-005",
    name: "Ohiomah Divine",
    class: "Nursery 1",
    gender: "Female",
    dateOfBirth: "2021-05-30",
    guardians: [{ name: "Mr. and Mrs. Ohiomah", contactNumber: "+2348000000011" }],
    enrollmentDate: "2023-09-10",
  },
  {
    id: "BH-N1-006",
    name: "Akpan Light",
    class: "Nursery 1",
    gender: "Male",
    dateOfBirth: "2021-11-12",
    guardians: [{ name: "Mr. and Mrs. Akpan", contactNumber: "+2348000000012" }],
    enrollmentDate: "2023-09-10",
  },
  {
    id: "BH-N1-007",
    name: "Ose-Amen Greatgolden",
    class: "Nursery 1",
    gender: "Male",
    dateOfBirth: "2021-08-08",
    guardians: [{ name: "Mr. and Mrs. Ose-Amen", contactNumber: "+2348000000013" }],
    enrollmentDate: "2023-09-11",
  },
  // Preschool 2
  {
    id: "BH-PS2-001",
    name: "Onadefeji Zemirah",
    class: "Preschool 2",
    gender: "Female",
    dateOfBirth: "2022-02-14",
    guardians: [{ name: "Mr. and Mrs. Onadefeji", contactNumber: "+2348000000014" }],
    enrollmentDate: "2024-09-05",
  },
  {
    id: "BH-PS2-002",
    name: "Popoola Adekisha",
    class: "Preschool 2",
    gender: "Female",
    dateOfBirth: "2022-05-09",
    guardians: [{ name: "Mr. and Mrs. Popoola", contactNumber: "+2348000000015" }],
    enrollmentDate: "2024-09-05",
  },
  {
    id: "BH-PS2-003",
    name: "Kareem Jayden",
    class: "Preschool 2",
    gender: "Male",
    dateOfBirth: "2022-01-28",
    guardians: [{ name: "Mr. and Mrs. Kareem", contactNumber: "+2348000000016" }],
    enrollmentDate: "2024-09-06",
  },
  {
    id: "BH-PS2-004",
    name: "Ikejiuba Timile",
    class: "Preschool 2",
    gender: "Male",
    dateOfBirth: "2022-07-03",
    guardians: [{ name: "Mr. and Mrs. Ikejiuba", contactNumber: "+2348000000017" }],
    enrollmentDate: "2024-09-06",
  },
  {
    id: "BH-PS2-005",
    name: "Afolabi Ezekiel",
    class: "Preschool 2",
    gender: "Male",
    dateOfBirth: "2022-03-19",
    guardians: [{ name: "Mr. and Mrs. Afolabi", contactNumber: "+2348000000018" }],
    enrollmentDate: "2024-09-07",
  },
  {
    id: "BH-PS2-006",
    name: "Adeshina Khalid",
    class: "Preschool 2",
    gender: "Male",
    dateOfBirth: "2022-09-25",
    guardians: [{ name: "Mr. and Mrs. Adeshina", contactNumber: "+2348000000019" }],
    enrollmentDate: "2024-09-07",
  },
  {
    id: "BH-PS2-007",
    name: "George Angel",
    class: "Preschool 2",
    gender: "Female",
    dateOfBirth: "2022-11-30",
    guardians: [{ name: "Mr. and Mrs. George", contactNumber: "+2348000000020" }],
    enrollmentDate: "2024-09-08",
  },
  // Preschool 1
  {
    id: "BH-PS1-001",
    name: "Agboola Ajita",
    class: "Preschool 1",
    gender: "Female",
    dateOfBirth: "2023-02-10",
    guardians: [{ name: "Mr. and Mrs. Agboola", contactNumber: "+2348000000021" }],
    enrollmentDate: "2025-09-05",
  },
  {
    id: "BH-PS1-002",
    name: "Adeyemo Micah",
    class: "Preschool 1",
    gender: "Male",
    dateOfBirth: "2023-04-18",
    guardians: [{ name: "Mr. and Mrs. Adeyemo", contactNumber: "+2348000000022" }],
    enrollmentDate: "2025-09-05",
  },
  {
    id: "BH-PS1-003",
    name: "Ogara Elijah",
    class: "Preschool 1",
    gender: "Male",
    dateOfBirth: "2023-06-07",
    guardians: [{ name: "Mr. and Mrs. Ogara", contactNumber: "+2348000000023" }],
    enrollmentDate: "2025-09-06",
  },
  {
    id: "BH-PS1-004",
    name: "Sha Faiza",
    class: "Preschool 1",
    gender: "Female",
    dateOfBirth: "2023-01-25",
    guardians: [{ name: "Mr. and Mrs. Sha", contactNumber: "+2348000000024" }],
    enrollmentDate: "2025-09-06",
  },
  {
    id: "BH-PS1-005",
    name: "Ineghenose Harry",
    class: "Preschool 1",
    gender: "Male",
    dateOfBirth: "2023-05-13",
    guardians: [{ name: "Mr. and Mrs. Ineghenose", contactNumber: "+2348000000025" }],
    enrollmentDate: "2025-09-07",
  },
  {
    id: "BH-PS1-006",
    name: "Harrison Nathan",
    class: "Preschool 1",
    gender: "Male",
    dateOfBirth: "2023-08-02",
    guardians: [{ name: "Mr. and Mrs. Harrison", contactNumber: "+2348000000026" }],
    enrollmentDate: "2025-09-07",
  },
  {
    id: "BH-PS1-007",
    name: "Eke Star",
    class: "Preschool 1",
    gender: "Female",
    dateOfBirth: "2023-03-29",
    guardians: [{ name: "Mr. and Mrs. Eke", contactNumber: "+2348000000027" }],
    enrollmentDate: "2025-09-08",
  },
  {
    id: "BH-PS1-008",
    name: "Agboyin Jephzibah",
    class: "Preschool 1",
    gender: "Female",
    dateOfBirth: "2023-07-21",
    guardians: [{ name: "Mr. and Mrs. Agboyin", contactNumber: "+2348000000028" }],
    enrollmentDate: "2025-09-08",
  },
  {
    id: "BH-PS1-009",
    name: "Ogukie Joy",
    class: "Preschool 1",
    gender: "Female",
    dateOfBirth: "2023-09-11",
    guardians: [{ name: "Mr. and Mrs. Ogukie", contactNumber: "+2348000000029" }],
    enrollmentDate: "2025-09-09",
  },
  // Playgroup
  {
    id: "BH-PG-001",
    name: "Fagade Samuel",
    class: "Playgroup",
    gender: "Male",
    dateOfBirth: "2024-01-05",
    guardians: [{ name: "Mr. and Mrs. Fagade", contactNumber: "+2348000000030" }],
    enrollmentDate: "2025-09-10",
  },
  {
    id: "BH-PG-002",
    name: "Innocent Nathan",
    class: "Playgroup",
    gender: "Male",
    dateOfBirth: "2024-03-14",
    guardians: [{ name: "Mr. and Mrs. Innocent", contactNumber: "+2348000000031" }],
    enrollmentDate: "2025-09-10",
  },
  {
    id: "BH-PG-003",
    name: "Popoola Adekishi",
    class: "Playgroup",
    gender: "Female",
    dateOfBirth: "2024-05-22",
    guardians: [{ name: "Mr. and Mrs. Popoola", contactNumber: "+2348000000032" }],
    enrollmentDate: "2025-09-11",
  },
  {
    id: "BH-PG-004",
    name: "Ayowole Mabel",
    class: "Playgroup",
    gender: "Female",
    dateOfBirth: "2024-02-17",
    guardians: [{ name: "Mr. and Mrs. Ayowole", contactNumber: "+2348000000033" }],
    enrollmentDate: "2025-09-11",
  },
  {
    id: "BH-PG-005",
    name: "Okonkwo Marvelous",
    class: "Playgroup",
    gender: "Male",
    dateOfBirth: "2024-06-09",
    guardians: [{ name: "Mr. and Mrs. Okonkwo", contactNumber: "+2348000000034" }],
    enrollmentDate: "2025-09-12",
  },
  {
    id: "BH-PG-006",
    name: "Jecolua Diadem",
    class: "Playgroup",
    gender: "Female",
    dateOfBirth: "2024-04-28",
    guardians: [{ name: "Mr. and Mrs. Jecolua", contactNumber: "+2348000000035" }],
    enrollmentDate: "2025-09-12",
  },
  {
    id: "BH-PG-007",
    name: "Odunsanya Valera",
    class: "Playgroup",
    gender: "Female",
    dateOfBirth: "2024-08-16",
    guardians: [{ name: "Mr. and Mrs. Odunsanya", contactNumber: "+2348000000036" }],
    enrollmentDate: "2025-09-13",
  },
  {
    id: "BH-PG-008",
    name: "Lamidi Zody",
    class: "Playgroup",
    gender: "Male",
    dateOfBirth: "2024-10-03",
    guardians: [{ name: "Mr. and Mrs. Lamidi", contactNumber: "+2348000000037" }],
    enrollmentDate: "2025-09-13",
  },
]

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

export default function StudentsPage() {
  const searchParams = useSearchParams()
  const classFromQuery = searchParams.get("class")
  const initialSelectedClass = classFromQuery && classFromQuery.length > 0 ? classFromQuery : "all"

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState(initialSelectedClass)
  const [students, setStudents] = useState<Student[]>(studentsData)
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [newStudent, setNewStudent] = useState({
    name: "",
    class: "",
    dateOfBirth: "",
    gender: "",
    guardians: [{ name: "", contactNumber: "" }] as Guardian[],
  })
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false)
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null)
  const [editStudent, setEditStudent] = useState({
    name: "",
    class: "",
    dateOfBirth: "",
    gender: "",
    guardians: [{ name: "", contactNumber: "" }] as Guardian[],
  })
  const [isDeleteStudentOpen, setIsDeleteStudentOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<{ id: string; name: string } | null>(null)

  // Filter students based on search and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.guardians.some(
        (guardian) =>
          guardian.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guardian.contactNumber.toLowerCase().includes(searchTerm.toLowerCase()),
      )

    const matchesClass = selectedClass === "all" || student.class === selectedClass

    return matchesSearch && matchesClass
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewStudent((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditStudent((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setNewStudent((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSelectChange = (name: string, value: string) => {
    setEditStudent((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newId = `LL-${new Date().getFullYear()}-${String(students.length + 1).padStart(3, "0")}`
    const newRecord: Student = {
      id: newId,
      name: newStudent.name,
      class: newStudent.class,
      gender: newStudent.gender,
      dateOfBirth: newStudent.dateOfBirth,
      guardians: newStudent.guardians.filter((guardian) => guardian.name || guardian.contactNumber),
      enrollmentDate: new Date().toISOString().split("T")[0],
    }
    setStudents((prev) => [...prev, newRecord])
    setIsAddStudentOpen(false)
    // Reset form
    setNewStudent({
      name: "",
      class: "",
      gender: "",
      dateOfBirth: "",
      guardians: [{ name: "", contactNumber: "" }],
    })
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStudentId) return
    setStudents((prev) =>
      prev.map((student) =>
        student.id === editingStudentId
          ? {
              ...student,
              name: editStudent.name,
              class: editStudent.class,
              gender: editStudent.gender,
              dateOfBirth: editStudent.dateOfBirth,
              guardians: editStudent.guardians.filter((guardian) => guardian.name || guardian.contactNumber),
            }
          : student,
      ),
    )
    setIsEditStudentOpen(false)
    setEditingStudentId(null)
    setEditStudent({
      name: "",
      class: "",
      gender: "",
      dateOfBirth: "",
      guardians: [{ name: "", contactNumber: "" }],
    })
  }

  const handleEditClick = (student: (typeof studentsData)[number]) => {
    setEditingStudentId(student.id)
    setEditStudent({
      name: student.name,
      class: student.class,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
      guardians: student.guardians.length
        ? student.guardians
        : [
            {
              name: "",
              contactNumber: "",
            },
          ],
    })
    setIsEditStudentOpen(true)
  }

  const handleDeleteClick = (student: (typeof studentsData)[number]) => {
    setStudentToDelete({ id: student.id, name: student.name })
    setIsDeleteStudentOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!studentToDelete) return
    setStudents((prev) => prev.filter((student) => student.id !== studentToDelete.id))
    setIsDeleteStudentOpen(false)
    setStudentToDelete(null)
  }

  const handleCancelDelete = () => {
    setIsDeleteStudentOpen(false)
    setStudentToDelete(null)
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
              href="/admin/students"
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
            >
              <User className="h-4 w-4" />
              Students
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
              <h1 className="text-2xl font-bold tracking-tight">Students</h1>
              <p className="text-muted-foreground">Manage and view all enrolled students</p>
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
              <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>Enter the student details to add a new enrollment</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Student Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={newStudent.name}
                            onChange={handleInputChange}
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="class">Class</Label>
                          <Select
                            value={newStudent.class}
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
                            value={newStudent.dateOfBirth}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            value={newStudent.gender}
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
                          {newStudent.guardians.map((guardian, index) => (
                            <div key={index} className="grid grid-cols-[1.5fr_1.5fr_auto] gap-2">
                              <Input
                                name="guardianName"
                                value={guardian.name}
                                onChange={(e) =>
                                  setNewStudent((prev) => {
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
                                  setNewStudent((prev) => {
                                    const next = [...prev.guardians]
                                    next[index] = { ...next[index], contactNumber: e.target.value }
                                    return { ...prev, guardians: next }
                                  })
                                }
                                placeholder="Contact number"
                              />
                              <div className="flex items-center justify-end gap-2">
                                {newStudent.guardians.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      setNewStudent((prev) => ({
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
                              disabled={newStudent.guardians.length >= 3}
                              onClick={() =>
                                setNewStudent((prev) => ({
                                  ...prev,
                                  guardians: [...prev.guardians, { name: "", contactNumber: "" }],
                                }))
                              }
                            >
                              Add guardian
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddStudentOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Student</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            <Dialog open={isEditStudentOpen} onOpenChange={setIsEditStudentOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Edit Student</DialogTitle>
                  <DialogDescription>Update the student details and save the changes</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEditSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Student Name</Label>
                        <Input
                          id="edit-name"
                          name="name"
                          value={editStudent.name}
                          onChange={handleEditInputChange}
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-class">Class</Label>
                        <Select
                          value={editStudent.class}
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
                          value={editStudent.dateOfBirth}
                          onChange={handleEditInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-gender">Gender</Label>
                        <Select
                          value={editStudent.gender}
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
                        {editStudent.guardians.map((guardian, index) => (
                          <div key={index} className="grid grid-cols-[1.5fr_1.5fr_auto] gap-2">
                            <Input
                              name="guardianName"
                              value={guardian.name}
                              onChange={(e) =>
                                setEditStudent((prev) => {
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
                                setEditStudent((prev) => {
                                  const next = [...prev.guardians]
                                  next[index] = { ...next[index], contactNumber: e.target.value }
                                  return { ...prev, guardians: next }
                                })
                              }
                              placeholder="Contact number"
                            />
                            <div className="flex items-center justify-end gap-2">
                              {editStudent.guardians.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    setEditStudent((prev) => ({
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
                            disabled={editStudent.guardians.length >= 3}
                            onClick={() =>
                              setEditStudent((prev) => ({
                                ...prev,
                                guardians: [...prev.guardians, { name: "", contactNumber: "" }],
                              }))
                            }
                          >
                            Add guardian
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditStudentOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={isDeleteStudentOpen} onOpenChange={setIsDeleteStudentOpen}>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Delete student</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete{" "}
                    <span className="font-semibold">{studentToDelete?.name}</span>? This action cannot be undone.
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
                <CardTitle>All Students</CardTitle>
                <CardDescription>{filteredStudents.length} students enrolled</CardDescription>
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
                      <TableHead>Student ID</TableHead>
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
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student, index) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className="font-medium">{student.id}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell>{getAgeFromDateOfBirth(student.dateOfBirth)}</TableCell>
                          <TableCell>{student.gender}</TableCell>
                          <TableCell>{student.guardians.map((guardian) => guardian.name).join(", ")}</TableCell>
                          <TableCell>{student.guardians.map((guardian) => guardian.contactNumber).join(", ")}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="icon" onClick={() => handleEditClick(student)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-destructive"
                                onClick={() => handleDeleteClick(student)}
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
                          No students found.
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
