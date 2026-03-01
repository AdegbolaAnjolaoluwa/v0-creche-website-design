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

  // Handle Unauthorized State explicitly
  if (unauthorized && isSignedIn) {
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

  // Icons mapping for classes (simplified)
  const getClassIcon = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes("crèche") || n.includes("creche")) return <Baby className="h-6 w-6" />
    if (n.includes("preschool")) return <GraduationCap className="h-6 w-6" />
    if (n.includes("nursery")) return <Sprout className="h-6 w-6" />
    if (n.includes("afterschool") || n.includes("primary")) return <Rocket className="h-6 w-6" />
    return <GraduationCap className="h-6 w-6" />
  }

  if (isSignedIn && user && !unauthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eff6ff] vibrant-pattern">
        <div className="text-center bg-white/90 p-8 rounded-3xl shadow-xl backdrop-blur-sm">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-[#1e2b6d] mb-4" />
          <p className="text-[#1e2b6d] font-medium">Redirecting to dashboard...</p>
        </div>
      </div>
    )
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

  if (unauthorized) {
    const email = user?.primaryEmailAddress?.emailAddress || ""
    const isAdminEmail = email.includes("admin") || email.includes("anjeesax")

    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eff6ff] vibrant-pattern p-6">
        <div className="w-full max-w-md p-8 text-center bg-white rounded-[30px] shadow-xl border-2 border-red-100">
          <div className="mb-6 w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-[#1e2b6d]">Access Denied</h3>
          <p className="text-slate-500 mb-8 font-medium">
            Your account is signed in but does not have the required permissions to access the dashboard.
          </p>

          <div className="mb-4">
              <Button
                onClick={handleFixPermissions}
                disabled={isFixing}
                className="w-full mb-3"
              >
                {isFixing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isFixing ? "Fixing..." : "Auto-Fix Permissions"}
              </Button>
          </div>

          <button
            onClick={() => signOut(() => router.push("/login"))}
            className="w-full py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-bold shadow-lg shadow-red-500/20"
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 bg-[#eff6ff] vibrant-pattern overflow-x-hidden ${fredoka.variable} ${inter.variable} font-sans`}>
      <style jsx global>{`
        .vibrant-pattern {
          background-color: #eff6ff;
          background-image: 
              radial-gradient(#1e2b6d 1.5px, transparent 1.5px), 
              radial-gradient(#facc15 1.5px, #eff6ff 1.5px); 
          background-size: 60px 60px; 
          background-position: 0 0, 30px 30px; 
          position: relative;
        }
        .vibrant-pattern::before {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background-image: 
              linear-gradient(45deg, #22c55e 25%, transparent 25%), 
              linear-gradient(-45deg, #22c55e 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #22c55e 75%), 
              linear-gradient(-45deg, transparent 75%, #22c55e 75%);
          background-size: 80px 80px;
          background-position: 0 0, 0 40px, 40px -40px, -40px 0px;
          opacity: 0.05;
          z-index: 0;
          pointer-events: none;
        }
        .glass-card {
          backdrop-filter: blur(10px);
          box-shadow: 20px 20px 0px rgba(30, 43, 109, 0.1);
        }
      `}</style>

      {/* Floating Shapes */}
      <div className="fixed top-10 left-10 w-24 h-24 bg-[#facc15] rounded-full opacity-20 hidden lg:block animate-pulse"></div>
      <div className="fixed bottom-20 left-20 w-32 h-32 border-8 border-[#22c55e] rounded-2xl rotate-12 opacity-20 hidden lg:block"></div>
      <div className="fixed top-20 right-20 w-40 h-40 bg-[#1e2b6d] rounded-tl-[80px] opacity-10 hidden lg:block"></div>

      <div className="max-w-xl w-full flex flex-col items-center relative z-10">

        {/* Logo Section */}
        <div className="mb-10 text-center">
          <div className="bg-white p-4 rounded-full shadow-lg inline-block mb-6 transform -rotate-3">
            <Image
              alt="Bayhood Preparatory School Logo"
              className="h-16 w-auto object-contain mx-auto"
              src="/logo.jpg"
              width={100}
              height={100}
            />
          </div>
          <div className="relative">
            <h1 className={`text-4xl font-bold text-[#1e2b6d] tracking-tight ${fredoka.className}`}>Welcome back!</h1>
            <p className="text-slate-600 mt-2 font-medium">Ready for another day of learning?</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white rounded-[40px] glass-card border-2 border-[#1e2b6d]/10 overflow-hidden transform hover:-translate-y-1 transition-all duration-300">

          {loginView === "selection" && (
            <div className="p-10 space-y-6">
              <h2 className="text-2xl font-bold text-[#1e2b6d] text-center mb-6">Who are you logging in as?</h2>

              <button
                onClick={() => setLoginView("staff")}
                className="w-full group p-6 border-2 border-slate-100 hover:border-[#1e2b6d] bg-slate-50 hover:bg-white rounded-3xl flex items-center justify-between transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] text-[#1e2b6d] flex items-center justify-center group-hover:bg-[#1e2b6d] group-hover:text-white transition-colors">
                    <GraduationCap className="h-7 w-7" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-[#1e2b6d]">Staff Login</h3>
                    <p className="text-sm text-slate-500 font-medium">Teachers & Administrators</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-[#1e2b6d] group-hover:bg-[#1e2b6d] group-hover:text-white transition-all">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </button>

              <button
                onClick={() => setLoginView("parent")}
                className="w-full group p-6 border-2 border-slate-100 hover:border-[#22c55e] bg-slate-50 hover:bg-white rounded-3xl flex items-center justify-between transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] text-[#22c55e] flex items-center justify-center group-hover:bg-[#22c55e] group-hover:text-white transition-colors">
                    <User className="h-7 w-7" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-[#1e2b6d]">Parent Portal</h3>
                    <p className="text-sm text-slate-500 font-medium">Parents & Guardians</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-[#22c55e] group-hover:bg-[#22c55e] group-hover:text-white transition-all">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </button>
            </div>
          )}

          {(loginView === "staff" || loginView === "parent") && (
            <div className="relative">
              {!typeParam && (
                <div className="absolute top-6 left-6 z-10">
                  <button
                    onClick={() => setLoginView("selection")}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#1e2b6d] transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                </div>
              )}

              <div className="pt-16 px-10 pb-10">
                <h2 className="text-2xl font-bold text-[#1e2b6d] text-center mb-8">
                  {loginView === "staff" ? "Staff Login" : "Parent Portal"}
                </h2>

                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form className="space-y-6" onSubmit={handleLogin}>

                  {loginView === "staff" ? (
                    <>
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-[#1e2b6d] mb-2" htmlFor="email">Email Address</label>
                          <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1e2b6d]/40 group-focus-within:text-[#1e2b6d] transition-colors">
                              <AtSign className="h-5 w-5" />
                            </span>
                            <input
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-[#1e2b6d] transition-all outline-none text-sm font-medium"
                              id="email"
                              name="email"
                              placeholder="name@school.com"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-bold text-[#1e2b6d]" htmlFor="password">Password</label>
                            <Link className="text-xs font-bold text-[#22c55e] hover:underline" href="/forgot-password">Forgot?</Link>
                          </div>
                          <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1e2b6d]/40 group-focus-within:text-[#1e2b6d] transition-colors">
                              <Lock className="h-5 w-5" />
                            </span>
                            <input
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-[#1e2b6d] transition-all outline-none text-sm font-medium"
                              id="password"
                              name="password"
                              placeholder="••••••••"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-[#1e2b6d] mb-2" htmlFor="parent-email">Email Address</label>
                          <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1e2b6d]/40 group-focus-within:text-[#1e2b6d] transition-colors">
                              <AtSign className="h-5 w-5" />
                            </span>
                            <input
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-[#1e2b6d] transition-all outline-none text-sm font-medium"
                              id="parent-email"
                              name="parent-email"
                              placeholder="parent@example.com"
                              type="email"
                              value={parentEmail}
                              onChange={(e) => setParentEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-bold text-[#1e2b6d]" htmlFor="parent-password">Password</label>
                          </div>
                          <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1e2b6d]/40 group-focus-within:text-[#1e2b6d] transition-colors">
                              <Lock className="h-5 w-5" />
                            </span>
                            <input
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-[#1e2b6d] transition-all outline-none text-sm font-medium"
                              id="parent-password"
                              name="parent-password"
                              placeholder="••••••••"
                              type="password"
                              value={parentPassword}
                              onChange={(e) => setParentPassword(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-[#1e2b6d] hover:bg-[#1e2b6d]/90 text-white font-bold rounded-xl shadow-lg shadow-[#1e2b6d]/20 transform hover:-translate-y-1 active:translate-y-0 transition-all duration-200"
                  >
                    {isLoading ? "Signing in..." : "Sign In to Portal"}
                  </button>

                </form>
              </div>
            </div>
          )}

        </div>



        <div className="mt-8 text-center">
          <p className="text-xs font-medium text-slate-500">© 2024 Bayhood Preparatory School. All rights reserved.</p>
        </div>

      </div>
    </div>
  )
}