"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useSignIn, useUser, useOrganizationList } from "@clerk/nextjs"
import { AtSign, Lock, GraduationCap, Baby, Sprout, Rocket, User, ArrowRight, ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import { Fredoka, Inter } from "next/font/google"
import { classesData } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const typeParam = searchParams.get("type")
  
  // Auto-redirect if already signed in
  const { isSignedIn, user } = useUser()
  const { isLoaded: isOrgLoaded, userMemberships, setActive: setOrgActive } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  })

  useEffect(() => {
    if (isSignedIn && user) {
       const email = user.primaryEmailAddress?.emailAddress || ""
       
       // Check Metadata Role
       const role = (user.publicMetadata as any)?.role

       if (role === 'org:admin' || email.toLowerCase().includes("admin") || email.toLowerCase().includes("anjeesax")) {
           router.replace("/admin/dashboard")
       } else if (role === 'org:staff') {
           router.replace("/staff/dashboard")
       } else if (role === 'org:parent') {
           router.replace("/parent/dashboard")
       } else {
           // Fallback to org membership logic if metadata is missing (legacy support)
            if (isOrgLoaded && userMemberships.data && userMemberships.data.length > 0 && setOrgActive) {
                const adminMembership = userMemberships.data.find(m => m.role === 'org:admin')
                const targetOrg = adminMembership ? adminMembership.organization : userMemberships.data[0].organization
                setOrgActive({ organization: targetOrg.id }).then(() => {
                    if (adminMembership) router.replace("/admin/dashboard")
                    else router.replace("/staff/dashboard")
                })
            }
       }
    }
  }, [isSignedIn, user, router, isOrgLoaded, userMemberships, setOrgActive])
  
  // Login State: "selection", "staff", "parent"
  const [loginView, setLoginView] = useState<"selection" | "staff" | "parent">("selection")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Staff State
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  // Parent State (Note: We are switching to Email for parents too as Invitations use Email)
  const [parentEmail, setParentEmail] = useState("")
  const [parentPassword, setParentPassword] = useState("")

  useEffect(() => {
    if (typeParam === "parent") {
      setLoginView("parent")
    } else if (typeParam === "staff") {
      setLoginView("staff")
    } else {
      setLoginView("selection")
    }
  }, [typeParam])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setError("")

    const identifier = (loginView === "staff" ? email : parentEmail).trim()
    const pass = loginView === "staff" ? password : parentPassword

    if (!identifier || !pass) {
      setError("Please enter both email and password.")
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn.create({
        identifier,
        password: pass,
      })

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        // Redirect logic is handled by Clerk or we can force it
        // Check the role to decide where to go (optional, as middleware handles basic protection)
        // But for better UX, let's redirect to the right dashboard
        
        // Wait a moment for session to propagate
        setTimeout(() => {
            if (loginView === "staff") {
                 // Check if it's an admin (this is a client-side hint, middleware is the real guard)
                 if (identifier.toLowerCase().includes("admin") || identifier.toLowerCase() === "anjeesax@gmail.com") {
                     router.push("/admin/dashboard")
                 } else {
                     router.push("/staff/dashboard")
                 }
            } else {
                 router.push("/parent/dashboard")
            }
        }, 500)
      } else {
        console.log(result)
        // Check for specific statuses to give better feedback
        if (result.status === "needs_first_factor") {
            setError("Login incomplete. Additional verification required (e.g. Email Code).")
        } else if (result.status === "needs_second_factor") {
            setError("Login incomplete. Two-factor authentication required.")
        } else if (result.status === "needs_identifier") {
            setError("Login incomplete. Please provide your email.")
        } else {
            setError(`Login incomplete. Status: ${result.status}`)
        }
      }
    } catch (err: any) {
      console.error("Login error:", err)
      const errors = err.errors || []
      const error = errors[0]
      
      if (error?.code === "form_identifier_not_found") {
        setError("Account not found. Please contact your administrator.")
      } else if (error?.code === "form_password_incorrect") {
        setError("Incorrect password. Please try again.")
      } else if (error?.code === "too_many_attempts") {
         setError("Too many attempts. Please try again later.")
      } else {
        setError(error?.longMessage || "An unexpected error occurred.")
      }
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