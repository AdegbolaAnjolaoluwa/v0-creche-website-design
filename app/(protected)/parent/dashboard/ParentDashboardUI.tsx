"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useClerk, useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogOut } from "lucide-react"

export default function ParentDashboardUI({ initialData }: { initialData: any }) {
  const router = useRouter()
  const { signOut } = useClerk()
  const { user, isLoaded, isSignedIn } = useUser()
  const [linkPupilId, setLinkPupilId] = useState("")
  const [isLinking, setIsLinking] = useState(false)

  // If no data and not logged in, redirect
  useEffect(() => {
      if (isLoaded && !isSignedIn && !initialData) {
          router.push("/login")
      }
  }, [isLoaded, isSignedIn, initialData, router])

  const handleLogout = () => {
    signOut(() => router.push("/login"))
  }

  if (!initialData) {
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
                    {/* Link form logic would go here, calling an API to set the cookie or link email */}
                    <div className="text-center text-sm text-muted-foreground mb-4">
                        No pupil data found. Please log in with your Pupil ID.
                    </div>
                    <Button onClick={() => router.push("/login")} className="w-full">
                        Go to Login
                    </Button>
                </CardContent>
            </Card>
        </div>
      )
  }

  const { pupil, results } = initialData

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold">Welcome, {pupil.name}</h1>
            <p className="text-muted-foreground">Class: {pupil.classId}</p>
        </div>
        <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Academic Results</CardTitle>
        </CardHeader>
        <CardContent>
            {results.length === 0 ? (
                <p>No results available yet.</p>
            ) : (
                <ul className="space-y-2">
                    {results.map((r: any) => (
                        <li key={r.id} className="p-4 border rounded-lg">
                            <div className="font-semibold">{r.term} - {r.academicYear}</div>
                            <div>Average Score: {r.averageScore}%</div>
                            <div>Grade: {r.grade}</div>
                        </li>
                    ))}
                </ul>
            )}
        </CardContent>
      </Card>
    </div>
  )
}
