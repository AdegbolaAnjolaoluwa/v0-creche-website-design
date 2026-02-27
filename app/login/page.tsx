"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AtSign, Lock, GraduationCap, Baby, Sprout, Rocket, User, ArrowRight, ArrowLeft } from "lucide-react"
import { Fredoka, Inter } from "next/font/google"
import { classesData } from "@/lib/data"

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const typeParam = searchParams.get("type")
  
  // Login State: "selection", "staff", "parent"
  const [loginView, setLoginView] = useState<"selection" | "staff" | "parent">("selection")
  const [isLoading, setIsLoading] = useState(false)
  
  // Staff State
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [classId, setClassId] = useState("")
  
  // Parent State
  const [parentPupilId, setParentPupilId] = useState("")
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

  const handleEmailChange = (val: string) => {
    setEmail(val)
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("staffClassAssignments")
      if (stored) {
        try {
          const assignments = JSON.parse(stored) as Record<string, { name: string, email: string } | string>
          const foundClassId = Object.keys(assignments).find(
            key => {
              const assignment = assignments[key]
              const assignmentEmail = typeof assignment === 'string' ? assignment : assignment.email
              return assignmentEmail.toLowerCase() === val.toLowerCase()
            }
          )
          if (foundClassId) {
            setClassId(foundClassId)
          }
        } catch (e) {
          console.error("Error parsing assignments", e)
        }
      }
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      if (typeof window !== "undefined") {
        if (loginView === "staff") {
          // Determine role based on email for demo purposes
          const isAdmin = email.toLowerCase() === "admin@bayhood.com"
          
          // Check for admin-defined staff assignments
          let assignedClassId = isAdmin ? undefined : classId
          if (!isAdmin && !classId) {
             // Try to find again if not set
             const storedAssignments = window.localStorage.getItem("staffClassAssignments")
             if (storedAssignments) {
                try {
                  const assignments = JSON.parse(storedAssignments) as Record<string, { name: string, email: string } | string>
                  const foundClassId = Object.keys(assignments).find(
                    key => {
                      const assignment = assignments[key]
                      const assignmentEmail = typeof assignment === 'string' ? assignment : assignment.email
                      return assignmentEmail.toLowerCase() === email.toLowerCase()
                    }
                  )
                  if (foundClassId) assignedClassId = foundClassId
                } catch {}
             }
          }

          const currentUser = {
            role: isAdmin ? ("admin" as const) : ("staff" as const),
            email: email,
            classId: assignedClassId,
          }
          window.localStorage.setItem("currentUser", JSON.stringify(currentUser))
          router.push(isAdmin ? "/admin/dashboard" : "/staff/dashboard")
          return
        }
        if (loginView === "parent") {
          const currentUser = {
            role: "parent" as const,
            pupilId: parentPupilId,
          }
          window.localStorage.setItem("currentUser", JSON.stringify(currentUser))
          router.push("/parent/dashboard")
          return
        }
      }
    }, 1500)
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

  // Quick fill for testing
  const fillAdmin = () => {
    setLoginView("staff")
    setEmail("admin@bayhood.com")
    setPassword("admin123")
  }

  const fillStaff = () => {
    setLoginView("staff")
    setEmail("staff@bayhood.com")
    setPassword("staff123")
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
                              onChange={(e) => handleEmailChange(e.target.value)}
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

                      {email.toLowerCase() !== "admin@bayhood.com" && (
                        <div>
                          <label className="block text-sm font-bold text-[#1e2b6d] mb-4">Select Your Assigned Class</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {classesData.slice(0, 4).map((cls) => (
                              <button 
                                key={cls.id}
                                type="button"
                                onClick={() => setClassId(cls.id)}
                                className={`group flex flex-col items-center justify-center p-4 border-2 rounded-2xl transition-all duration-300 ${classId === cls.id ? "border-[#1e2b6d] bg-[#1e2b6d] text-white shadow-lg scale-105" : "border-slate-100 bg-white hover:border-[#1e2b6d]/30 hover:shadow-md"}`}
                              >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${classId === cls.id ? "bg-white/20 text-white" : "bg-[#eff6ff] text-[#1e2b6d] group-hover:bg-[#1e2b6d] group-hover:text-white"}`}>
                                  {getClassIcon(cls.name)}
                                </div>
                                <span className="text-xs font-bold">{cls.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                       <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-[#1e2b6d] mb-2" htmlFor="pupil-id">Pupil ID</label>
                          <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1e2b6d]/40 group-focus-within:text-[#1e2b6d] transition-colors">
                              <User className="h-5 w-5" />
                            </span>
                            <input 
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-[#1e2b6d] transition-all outline-none text-sm font-medium" 
                              id="pupil-id" 
                              name="pupil-id" 
                              placeholder="BH-001" 
                              type="text"
                              value={parentPupilId}
                              onChange={(e) => setParentPupilId(e.target.value)}
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
        
        {/* Quick Access for Testing */}
        <div className="mt-8 p-6 bg-[#facc15]/20 border-2 border-[#facc15] rounded-3xl w-full backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4 text-[#1e2b6d] font-bold">
            <Lock className="h-5 w-5" />
            <span>Quick Access for Testing:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={fillAdmin}
              className="text-left p-3 bg-white/50 hover:bg-white rounded-xl transition-colors cursor-pointer"
            >
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Administrator</div>
              <div className="font-bold text-[#1e2b6d] text-sm">admin@bayhood.com</div>
            </button>
            <button 
              onClick={fillStaff}
              className="text-left p-3 bg-white/50 hover:bg-white rounded-xl transition-colors cursor-pointer"
            >
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Staff Member</div>
              <div className="font-bold text-[#1e2b6d] text-sm">staff@bayhood.com</div>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
           <p className="text-xs font-medium text-slate-500">© 2024 Bayhood Preparatory School. All rights reserved.</p>
        </div>

      </div>
    </div>
  )
}