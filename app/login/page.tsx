"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { GraduationCap, Lock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { classesData } from "@/app/admin/classes/page"

type AuroraProps = {
  colorStops?: string[]
  amplitude?: number
  blend?: number
}

const Aurora = ({ colorStops, amplitude = 1, blend = 0.85 }: AuroraProps) => {
  const stops = colorStops && colorStops.length > 0 ? colorStops : ["#ff2929", "#fcfcfc", "#cef024", "#00e626"]

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" style={{ opacity: blend }}>
      <div
        className="aurora-layer"
        style={
          {
            "--aurora-amplitude": amplitude,
            "--aurora-color-1": stops[0],
            "--aurora-color-2": stops[1] ?? stops[0],
            "--aurora-color-3": stops[2] ?? stops[0],
            "--aurora-color-4": stops[3] ?? stops[0],
          } as React.CSSProperties
        }
      />
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get("type") || "staff"
  const [isLoading, setIsLoading] = useState(false)
  const [staffEmail, setStaffEmail] = useState("")
  const [staffPassword, setStaffPassword] = useState("")
  const [staffClassId, setStaffClassId] = useState("")
  const [parentStudentId, setParentStudentId] = useState("")
  const [parentPassword, setParentPassword] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")

  const handleLogin = (event: React.FormEvent<HTMLFormElement>, userType: "staff" | "parent" | "admin") => {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      if (typeof window !== "undefined") {
        if (userType === "staff") {
          const currentUser = {
            role: "staff" as const,
            email: staffEmail,
            classId: staffClassId,
          }
          window.localStorage.setItem("currentUser", JSON.stringify(currentUser))
          router.push("/staff/dashboard")
          return
        }
        if (userType === "admin") {
          const currentUser = {
            role: "admin" as const,
            email: adminEmail,
          }
          window.localStorage.setItem("currentUser", JSON.stringify(currentUser))
          router.push("/admin/dashboard")
          return
        }
        if (userType === "parent") {
          const currentUser = {
            role: "parent" as const,
            studentId: parentStudentId,
          }
          window.localStorage.setItem("currentUser", JSON.stringify(currentUser))
          router.push("/parent/dashboard")
          return
        }
      }
      if (userType === "staff") {
        router.push("/admin/dashboard")
      } else {
        router.push("/parent/dashboard")
      }
    }, 1500)
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <Aurora colorStops={["#ff2929", "#fcfcfc", "#cef024", "#00e626"]} amplitude={1} blend={0.85} />
      <div className="relative z-10 flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-lg space-y-10">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.jpg"
                alt="School logo"
                width={360}
                height={108}
                className="h-24 w-auto md:h-28"
              />
            </Link>
            <h1 className="text-3xl font-bold md:text-4xl">Welcome back</h1>
            <p className="max-w-md text-sm text-muted-foreground md:text-base">
              Enter your credentials to access your account
            </p>
          </div>
          <Tabs defaultValue={type} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="staff" onClick={() => router.push("/login?type=staff")}>
                Staff
              </TabsTrigger>
              <TabsTrigger value="parent" onClick={() => router.push("/login?type=parent")}>
                Parent/Student
              </TabsTrigger>
              <TabsTrigger value="admin" onClick={() => router.push("/login?type=admin")}>
                Admin
              </TabsTrigger>
            </TabsList>
            <TabsContent value="staff" className="space-y-4">
              <div className="rounded-2xl border border-primary/10 bg-background/95 p-8 shadow-xl shadow-primary/10 backdrop-blur">
                <form onSubmit={(e) => handleLogin(e, "staff")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="staff-email">Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="staff-email"
                        type="email"
                        placeholder="name@school.com"
                        className="pl-10"
                        required
                        value={staffEmail}
                        onChange={(e) => setStaffEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="staff-password">Password</Label>
                      <Link href="#" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="staff-password"
                        type="password"
                        className="pl-10"
                        required
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staff-class">Assigned Class</Label>
                    <select
                      id="staff-class"
                      required
                      value={staffClassId}
                      onChange={(e) => setStaffClassId(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select class</option>
                      {classesData.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <p>For staff access only. If you need assistance, please contact the administrator.</p>
              </div>
            </TabsContent>
            <TabsContent value="parent" className="space-y-4">
              <div className="rounded-2xl border border-primary/10 bg-background/95 p-8 shadow-xl shadow-primary/10 backdrop-blur">
                <form onSubmit={(e) => handleLogin(e, "parent")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-id">Student ID</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="student-id"
                        placeholder="Enter student ID"
                        className="pl-10"
                        required
                        value={parentStudentId}
                        onChange={(e) => setParentStudentId(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="parent-password">Password</Label>
                      <Link href="#" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="parent-password"
                        type="password"
                        className="pl-10"
                        required
                        value={parentPassword}
                        onChange={(e) => setParentPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <p>For parents and students only. Use the student ID provided by the school.</p>
              </div>
            </TabsContent>
            <TabsContent value="admin" className="space-y-4">
              <div className="rounded-2xl border border-primary/10 bg-background/95 p-8 shadow-xl shadow-primary/10 backdrop-blur">
                <form onSubmit={(e) => handleLogin(e, "admin")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@school.com"
                        className="pl-10"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="admin-password">Password</Label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-password"
                        type="password"
                        className="pl-10"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <p>For administrative staff only.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
