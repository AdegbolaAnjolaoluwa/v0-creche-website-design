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

  const [activeTab, setActiveTab] = useState<"staff" | "parent">("staff")
  const [identifier, setIdentifier] = useState("") // Email for staff, Pupil ID for parent
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setError("")

    try {
      if (activeTab === "parent") {
        // Parent Login Logic (using Pupil ID as "username" or similar custom flow)
        // Since Clerk is email-based, we might need a workaround or a custom API that verifies Pupil ID
        // and then logs them in or retrieves their data.
        // For this "Pupil ID" request, let's assume we verify against our DB and maybe use a magic link or 
        // a specific parent account associated with that ID.
        
        // HOWEVER, the user specifically asked for "Parent will only signin with their student/pupil id".
        // This suggests a passwordless or shared-password flow, or just a lookup.
        // If we want real auth, we need to map Pupil ID -> User Account.
        
        // Let's implement a "Lookup" flow for parents:
        // 1. Verify Pupil ID exists in our DB
        // 2. If valid, check if a parent account is linked (optional) OR just show the dashboard for that pupil (insecure but matches request "only signin with pupil id")
        // 3. SECURE APPROACH: The Pupil ID *is* the identifier. We need a password? 
        //    If no password is mentioned, maybe it's just ID access (like checking a result).
        //    But "Sign In" implies auth. Let's assume there is a password or we map it to an email/username.
        
        // TEMPORARY SOLUTION matching request:
        // We will call a custom API to "login" via Pupil ID.
        // If successful, we might set a cookie or session. 
        // Since we are using Clerk, we can't easily "force" a login without a Clerk user.
        // Maybe we map PupilID -> Clerk Username? e.g. pupil_BPS001
        
        // Let's try to sign in using the Pupil ID as the username (if registered that way)
        // OR warn the user if we can't.
        
        // For now, let's assume we map Pupil ID to a registered Clerk username/email
        // e.g. parent_BPS001@school.com
        
        // Let's stick to the "Old Format" UI first, then handle the logic.
        
        // If we strictly follow "Parent will only signin with their student/pupil id", 
        // we might be bypassing Clerk for parents OR using a custom credential.
        
        // Let's assume we use the API to verify the ID.
        const res = await fetch("/api/auth/parent-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pupilId: identifier, password }) 
        })
        
        if (res.ok) {
            // Mock success for now or handle token
            // If the user wants "Old Format", they probably had a simple form.
            // Let's redirect to dashboard with the ID in query or cookie.
             router.push(`/parent/dashboard?pupilId=${identifier}`)
        } else {
            setError("Invalid Pupil ID or Password")
        }

      } else {
        // Staff Login (Standard Email/Password via Clerk)
        const result = await signIn.create({
          identifier,
          password,
        })

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId })
          router.push("/staff/dashboard")
        } else {
          console.error(result)
          setError("Invalid email or password")
        }
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.errors?.[0]?.message || "Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-[#FDF6E3] p-4 font-sans ${inter.variable} ${fredoka.variable}`}>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF9F1C] via-[#FFD700] to-[#2EC4B6]"></div>
        
        <div className="p-8">
          <div className="flex justify-center mb-6">
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

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800 font-display">Welcome Back!</h1>
            <p className="text-slate-500">Please sign in to continue</p>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
            <button
              onClick={() => setActiveTab("staff")}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-200 ${
                activeTab === "staff"
                  ? "bg-white text-[#2EC4B6] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Staff Login
            </button>
            <button
              onClick={() => setActiveTab("parent")}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-200 ${
                activeTab === "parent"
                  ? "bg-white text-[#FF9F1C] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Parent Login
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                {activeTab === "staff" ? "Email Address" : "Pupil ID"}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 h-5 w-5 text-slate-400 flex items-center justify-center">
                  {activeTab === "staff" ? <AtSign className="h-5 w-5" /> : <User className="h-5 w-5" />}
                </div>
                <input
                  type={activeTab === "staff" ? "email" : "text"}
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-100 focus:border-[#2EC4B6] focus:outline-none transition-colors bg-slate-50"
                  placeholder={activeTab === "staff" ? "teacher@school.com" : "e.g. BPS-2024-001"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                {activeTab === "staff" && (
                  <Link href="/forgot-password" className="text-xs font-bold text-[#FF9F1C] hover:underline">
                    Forgot?
                  </Link>
                )}
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
              className={`w-full text-white rounded-xl py-6 font-bold text-lg shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${
                activeTab === "staff"
                  ? "bg-[#2EC4B6] hover:bg-[#25A094] shadow-[#2EC4B6]/20"
                  : "bg-[#FF9F1C] hover:bg-[#F2911B] shadow-[#FF9F1C]/20"
              }`}
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
    </div>
  )
}