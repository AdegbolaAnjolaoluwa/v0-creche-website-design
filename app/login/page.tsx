"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useSignIn, useUser, useOrganizationList, useClerk } from "@clerk/nextjs"
import { AtSign, Lock, GraduationCap, Baby, Sprout, Rocket, User, ArrowRight, ArrowLeft, Loader2, AlertCircle, Mail, School, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SplashScreen } from "@/components/splash-screen"

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const { signOut } = useClerk()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // Get 'tab' query param (default to 'staff')
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState<"staff" | "parent">((tabParam as "staff" | "parent") || "staff")

  const unauthorized = searchParams.get("unauthorized")
  
  const [showSplash, setShowSplash] = useState(false)

  // Auto-redirect if already signed in
  const { isSignedIn, user } = useUser()

  useEffect(() => {
    if (tabParam === "staff" || tabParam === "parent") {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  useEffect(() => {
    // If user is already signed in
    if (isSignedIn && user) {
      if (unauthorized) {
        return; 
      }

      // If we are showing splash, don't redirect yet
      if (showSplash) return;

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
    }
  }, [isSignedIn, user, router, unauthorized, showSplash])

  const [identifier, setIdentifier] = useState("") 
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setError("")

    try {
      if (activeTab === "parent") {
        const res = await fetch("/api/auth/parent-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pupilId: identifier, password }) 
        })
        
        if (res.ok) {
             setShowSplash(true)
             // Splash screen will handle navigation via onComplete or we can do it after delay
             // For consistency with component, let's use the component's timer
        } else {
            const data = await res.json()
            setError(data.error || "Invalid Pupil ID or Password")
            setIsLoading(false)
        }

      } else {
        // Staff Login (Standard Email/Password via Clerk)
        const result = await signIn.create({
          identifier,
          password,
        })

        if (result.status === "complete") {
          setShowSplash(true)
          await setActive({ session: result.createdSessionId })
          // Redirect handled by useEffect once user is loaded with metadata
        } else {
          console.error(result)
          setError("Invalid email or password")
          setIsLoading(false) // Only stop loading on error
        }
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.errors?.[0]?.message || "Invalid credentials")
      setIsLoading(false)
    }
    // Remove finally block to keep loading state true on success while redirecting
  }

  const handleSplashComplete = () => {
    // Determine where to go based on tab or role
    if (activeTab === "parent") {
        router.push("/parent/dashboard")
        router.refresh()
    } else {
        // For staff, rely on the useEffect redirect after user metadata is loaded
        // But we need to disable splash state so the useEffect can trigger
        setShowSplash(false)
        
        // Fallback if metadata takes too long or is missing
        if (isSignedIn) {
            const role = (user?.publicMetadata as any)?.role
            if (role === 'org:admin') router.push("/admin/dashboard")
            else if (role === 'org:staff') router.push("/staff/dashboard")
        }
    }
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-[#eff6ff]">
          <div className={`absolute top-0 left-0 w-full h-full ${activeTab === 'staff' ? 'vibrant-pattern' : 'parent-pattern'}`}></div>
          
          {/* Decorative shapes */}
          <div className="absolute top-[10%] left-[5%] w-32 h-32 bg-[#1e2b6d] rounded-full opacity-15 hidden lg:block"></div>
          <div className="absolute bottom-[15%] left-[10%] w-40 h-40 border-[15px] border-[#facc15] rounded-3xl rotate-45 opacity-15 hidden lg:block"></div>
          <div className="absolute top-[20%] right-[8%] w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[80px] border-b-[#22c55e] opacity-15 hidden lg:block"></div>
          <div className="absolute bottom-[10%] right-[15%] w-24 h-24 bg-[#facc15] rounded-tl-[50px] opacity-15 hidden lg:block"></div>
      </div>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        
        <div className="mb-8 text-center">
            <div className="bg-white p-4 rounded-3xl shadow-md inline-block mb-6 transform hover:scale-105 transition-transform">
                <img 
                    src="/logo.jpg" 
                    alt="Bayhood Preparatory School Logo" 
                    className="h-20 w-auto object-contain mx-auto"
                />
            </div>
            <h1 className="text-4xl font-bold text-[#1e2b6d] tracking-tight">
                {activeTab === 'staff' ? 'Staff & Admin Portal' : 'Parent Portal Login'}
            </h1>
            <p className="text-slate-600 mt-2 font-medium">
                {activeTab === 'staff' ? 'Secure access for school management' : 'Connecting home and school life'}
            </p>
        </div>

        <div className="w-full bg-white rounded-[60px_20px_60px_20px] shadow-[0_20px_50px_rgba(30,43,109,0.15)] border-2 border-[#1e2b6d]/5 overflow-hidden transition-all duration-500 ease-in-out">
          
          {activeTab === 'parent' && (
            <div className="pt-10 px-8 text-center pb-0">
                <h2 className="text-xl font-bold text-[#1e2b6d]">Welcome Back</h2>
                <p className="text-sm text-slate-500 mt-1">Please enter your details to access the portal</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="p-8 lg:p-12 space-y-6 pt-6">
            {error && (
              <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200 rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label className="block text-sm font-bold text-[#1e2b6d] mb-2" htmlFor="email">
                {activeTab === "staff" ? "Staff Email Address" : "Parent Email"}
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1e2b6d]/30 group-focus-within:text-[#1e2b6d] transition-colors">
                  {activeTab === "staff" ? <AtSign className="h-5 w-5" /> : <AtSign className="h-5 w-5" />}
                </div>
                <Input
                  id="email"
                  type={activeTab === "staff" ? "email" : "text"}
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-[#1e2b6d] transition-all outline-none text-sm font-medium h-auto"
                  placeholder={activeTab === "staff" ? "staff@bayhood.com" : "email@example.com"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <Label className="block text-sm font-bold text-[#1e2b6d]" htmlFor="password">Password</Label>
                <Link href="#" className="text-xs font-bold text-[#22c55e] hover:underline">
                    Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1e2b6d]/30 group-focus-within:text-[#1e2b6d] transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-[#1e2b6d] transition-all outline-none text-sm font-medium h-auto"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1e2b6d] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
                <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1e2b6d] hover:bg-[#162054] text-white font-bold py-5 rounded-2xl shadow-xl hover:shadow-[#1e2b6d]/20 transition-all active:scale-[0.98] text-lg flex items-center justify-center gap-2 h-auto"
                >
                {isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...
                    </>
                ) : (
                    <>
                    <span>{activeTab === 'staff' ? 'Sign In to Portal' : 'Sign In to Parent Portal'}</span>
                    <ArrowRight className="h-6 w-6" />
                    </>
                )}
                </Button>
            </div>
            
            {activeTab === 'parent' && (
                <div className="text-center pt-2">
                    <p className="text-sm text-slate-500 font-medium">
                        New to Bayhood? <a href="#" className="text-[#1e2b6d] font-bold hover:underline">Register here</a>
                    </p>
                </div>
            )}
          </form>
        </div>
        
        {/* Footer Text */}
        <p className="mt-10 text-xs text-center text-slate-500 font-medium bg-white/40 px-6 py-2 rounded-full backdrop-blur-sm border border-white/50 w-fit mx-auto">
            © {new Date().getFullYear()} Bayhood Preparatory School. All rights reserved.
        </p>
      </div>

      <style jsx global>{`
        .vibrant-pattern {
             background-color: #eff6ff; 
             background-image:  
                 radial-gradient(circle at 20px 20px, #1e2b6d 2px, transparent 0), 
                 radial-gradient(circle at 60px 60px, #facc15 8px, transparent 0), 
                 radial-gradient(circle at 100px 30px, #22c55e 4px, transparent 0); 
             background-size: 120px 120px; 
        }
        .parent-pattern {
             background-color: #eff6ff; 
             background-image:  
                 radial-gradient(circle at 20px 20px, #3b82f6 2px, transparent 0), 
                 radial-gradient(circle at 60px 60px, #facc15 8px, transparent 0), 
                 radial-gradient(circle at 100px 30px, #ef4444 4px, transparent 0); 
             background-size: 120px 120px; 
        }
      `}</style>
    </div>
  )
}
