"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useSignIn, useUser, useOrganizationList, useClerk } from "@clerk/nextjs"
import { AtSign, Lock, GraduationCap, Baby, Sprout, Rocket, User, ArrowRight, ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import { Fredoka, Inter } from "next/font/google"
import { classesData } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const { signOut } = useClerk()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const typeParam = searchParams.get("type")
  const unauthorized = searchParams.get("unauthorized")

  // Auto-redirect if already signed in
  const { isSignedIn, user } = useUser()
  const { isLoaded: isOrgLoaded, userMemberships, setActive: setOrgActive } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  })

  useEffect(() => {
    // If user is already signed in
    if (isSignedIn && user) {
      // Check if we are in an "unauthorized" loop state
      if (unauthorized) {
        return; // Do NOT redirect, let them see the error and logout
      }

      // 1. Check Metadata Role (Preferred)
      const role = (user.publicMetadata as any)?.role

      if (role === 'org:admin') {
        router.replace("/admin/dashboard")
        return
      }
      if (role === 'org:staff') {
        router.replace("/staff/dashboard")
        return
      }
      if (role === 'org:parent') {
        router.replace("/parent/dashboard")
        return
      }

      // Let's not blindly redirect to dashboards without roles anymore 
      // because it causes infinite redirect loops if middleware rejects it.
      // Because of this change, users with missing roles will stay on the "Access Denied" screen,
      // preventing the infinite /login -> /admin/dashboard -> /login bounce.
    }
  }, [isSignedIn, user, router, unauthorized])

  // Login State: "login" only
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isFixing, setIsFixing] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setError("")

    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      })

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        // Redirect logic is handled by useEffect or Middleware mostly, 
        // but we can force a check here if needed.
        // Actually, the useEffect above will catch the new user state and redirect.
      } else {
        console.log(result)
        setError("Something went wrong during sign in.")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.errors?.[0]?.message || "Invalid email or password.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFixPermissions = async () => {
    setIsFixing(true)
    try {
      const res = await fetch("/api/debug/fix-role", { method: "POST" })
      if (res.ok) {
        const data = await res.json()
        toast({
          title: "Permissions Updated",
          description: `Your account has been updated to ${data.role}. Reloading...`,
        })
        // Force reload to pick up new metadata in session
        window.location.href = "/admin/dashboard"
      } else {
        throw new Error("Failed to update permissions")
      }
    } catch (e) {
      console.error(e)
      toast({
        title: "Error",
        description: "Could not auto-fix permissions. Please contact support.",
        variant: "destructive"
      })
    } finally {
      setIsFixing(false)
    }
  }

  // Handle Unauthorized State explicitly
  if (unauthorized && isSignedIn) {
     const email = user?.primaryEmailAddress?.emailAddress || ""
     // const isAdminEmail = email.includes("admin") || email.includes("anjeesax") // Unused

     return (
         <div className={`min-h-screen flex items-center justify-center bg-[#FDF6E3] p-4 font-sans ${inter.variable} ${fredoka.variable}`}>
             <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white">
                 <div className="p-8 text-center space-y-6">
                     <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                         <AlertCircle className="w-8 h-8 text-red-500" />
                     </div>
                     <h2 className="text-2xl font-bold text-slate-800 font-display">Access Denied</h2>
                     <p className="text-slate-500">
                         You do not have permission to access the requested page.
                         Please sign in with the correct account or contact support.
                     </p>
                     
                     {/* Debug Fix Button - Only show if we suspect they might be an admin locked out */}
                     {/* <div className="mb-4">
                        <Button
                            onClick={handleFixPermissions}
                            disabled={isFixing}
                            className="w-full mb-3"
                            variant="outline"
                        >
                            {isFixing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isFixing ? "Fixing..." : "Auto-Fix Permissions"}
                        </Button>
                     </div> */}

                     <Button 
                         variant="destructive" 
                         className="w-full rounded-xl py-6 font-bold text-lg"
                         onClick={() => signOut(() => router.push("/login"))}
                     >
                         Sign Out
                     </Button>
                 </div>
             </div>
         </div>
     )
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-[#FDF6E3] p-4 font-sans ${inter.variable} ${fredoka.variable}`}>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF9F1C] via-[#FFD700] to-[#2EC4B6]"></div>
        
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <Link href="/">
                <Image
                  src="/logo.jpg"
                  alt="School logo"
                  width={180}
                  height={54}
                  className="h-16 w-auto"
                />
            </Link>
          </div>

          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-slate-800 font-display">Welcome Back!</h1>
              <p className="text-slate-500">Sign in to your account</p>
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-100 focus:border-[#2EC4B6] focus:outline-none transition-colors bg-slate-50"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                  <Link href="/forgot-password" area-label="Forgot Password?" className="text-xs font-bold text-[#FF9F1C] hover:underline">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-100 focus:border-[#2EC4B6] focus:outline-none transition-colors bg-slate-50"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2EC4B6] hover:bg-[#25A094] text-white rounded-xl py-6 font-bold text-lg shadow-lg shadow-[#2EC4B6]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-bold text-[#FF9F1C] hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}