"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { GraduationCap, Lock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get("type") || "staff"
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (event: React.FormEvent<HTMLFormElement>, userType: string) => {
    event.preventDefault()
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      if (userType === "staff") {
        router.push("/admin/dashboard")
      } else {
        router.push("/parent/dashboard")
      }
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Little Learners</span>
            </Link>
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">Enter your credentials to access your account</p>
          </div>
          <Tabs defaultValue={type} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="staff" onClick={() => router.push("/login?type=staff")}>
                Staff
              </TabsTrigger>
              <TabsTrigger value="parent" onClick={() => router.push("/login?type=parent")}>
                Parent/Student
              </TabsTrigger>
            </TabsList>
            <TabsContent value="staff" className="space-y-4">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <form onSubmit={(e) => handleLogin(e, "staff")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="staff-email">Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="staff-email" type="email" placeholder="name@school.com" className="pl-10" required />
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
                      <Input id="staff-password" type="password" className="pl-10" required />
                    </div>
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
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <form onSubmit={(e) => handleLogin(e, "parent")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-id">Student ID</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="student-id" placeholder="Enter student ID" className="pl-10" required />
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
                      <Input id="parent-password" type="password" className="pl-10" required />
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
          </Tabs>
        </div>
      </div>
    </div>
  )
}

