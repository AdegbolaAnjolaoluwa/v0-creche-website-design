"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { SplashScreen } from "@/components/splash-screen"

export default function ParentLoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState("") 
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [blockedReason, setBlockedReason] = useState<string | null>(null)
  
  const [showSplash, setShowSplash] = useState(false)
  const [nextPath, setNextPath] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setBlockedReason(null)

    try {
      const res = await fetch("/api/auth/parent-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pupilId: identifier, password }) 
      })
      
      const data = await res.json()

      if (res.ok) {
           if (data.isFirstLogin) {
             setNextPath("/parent/change-password")
           } else {
             setNextPath("/parent/dashboard")
           }
           setShowSplash(true)
      } else {
          if (res.status === 403 && data.blocked) {
            setBlockedReason(data.reason)
          } else {
            setError(data.error || "Invalid Pupil ID or Password")
          }
          setIsLoading(false)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
    // Remove finally to keep loading state during splash
  }

  const handleSplashComplete = () => {
      router.push(nextPath)
      router.refresh()
  }

  if (showSplash) {
      return <SplashScreen onComplete={handleSplashComplete} />
  }

  if (blockedReason) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
        <Card className="w-full max-w-md border-red-200 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Image
                src="/logo.jpg"
                alt="Bayhood Preparatory School"
                width={180}
                height={54}
                className="h-16 w-auto"
              />
            </div>
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-xl text-red-700">Access Restricted</CardTitle>
            <CardDescription>
              Your access to the parent portal has been temporarily suspended.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 p-4 rounded-md border border-red-100">
              <p className="text-sm font-medium text-red-800 mb-1">Reason:</p>
              <p className="text-sm text-red-700">{blockedReason}</p>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Please contact the school administration for more information regarding this restriction.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={() => setBlockedReason(null)}>
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 font-sans">
      {/* Left Side - Image/Brand */}
      <div className="hidden lg:flex flex-col bg-primary/5 p-10 relative overflow-hidden">
        <div className="z-10">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="Bayhood Preparatory School"
              width={150}
              height={45}
              className="h-12 w-auto"
            />
          </Link>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center text-center max-w-lg mx-auto z-10">
          <h1 className="text-4xl font-bold mb-4 text-primary">
            Parent Portal
          </h1>
          <p className="text-lg text-muted-foreground">
            Stay connected with your child's academic journey. Access results, attendance records, and daily reports in one place.
          </p>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-yellow-200 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute top-1/4 -right-24 w-80 h-80 bg-blue-200 rounded-full opacity-50 blur-3xl"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col justify-center p-6 lg:p-10 bg-white">
        <div className="w-full max-w-sm mx-auto space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <Link href="/" className="lg:hidden inline-flex mb-8">
              <Image
                src="/logo.jpg"
                alt="Bayhood Preparatory School"
                width={180}
                height={54}
                className="h-14 w-auto"
              />
            </Link>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground">
              Enter your child's Pupil ID to access the portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="pupilId">Pupil ID</Label>
              <Input
                id="pupilId"
                placeholder="e.g. BPS-001"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value.toUpperCase())}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                First time? Your default password is your Pupil ID (e.g. BPS-001)
              </p>
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="text-center">
            <Link 
              href="/login?tab=staff" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
