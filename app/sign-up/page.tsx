"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { AtSign, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft } from "lucide-react"
import { Fredoka, Inter } from "next/font/google"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Form submit to start sign up
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setError("")

    try {
      await signUp.create({
        emailAddress: email,
        password,
      })

      // Send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

      // Change the UI to our pending section.
      setPendingVerification(true)
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      const errors = err.errors || []
      const errorMsg = errors[0]?.longMessage || errors[0]?.message
      
      if (errorMsg?.includes("already exists")) {
          setError("This account already exists. Please log in instead.")
      } else {
          setError(errorMsg || "Something went wrong during sign up.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Form submit to verify email
  const onPressVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setError("")

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })
      if (completeSignUp.status !== "complete") {
        // investigate the response, to see if there was an error
        // or if the user needs to complete more steps
        console.log(JSON.stringify(completeSignUp, null, 2))
        setError("Verification incomplete. Please try again.")
      }
      
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId })
        // Redirect logic similar to login
        if (email.toLowerCase().includes("admin") || email.toLowerCase().includes("anjeesax")) {
             router.push("/admin/dashboard")
        } else {
             router.push("/staff/dashboard")
        }
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      const errors = err.errors || []
      setError(errors[0]?.longMessage || "Invalid verification code.")
    } finally {
      setIsLoading(false)
    }
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
            <h1 className={`text-4xl font-bold text-[#1e2b6d] tracking-tight ${fredoka.className}`}>
               {pendingVerification ? "Verify Email" : "Create Account"}
            </h1>
            <p className="text-slate-600 mt-2 font-medium">
               {pendingVerification ? "We sent a code to your email." : "Join Bayhood Preparatory School"}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white rounded-[40px] glass-card border-2 border-[#1e2b6d]/10 overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
            
            <div className="relative">
               {!pendingVerification && (
                <div className="absolute top-6 left-6 z-10">
                  <Link 
                    href="/login"
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#1e2b6d] transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" /> Login
                  </Link>
                </div>
               )}

              <div className="pt-16 px-10 pb-10">
                <h2 className="text-2xl font-bold text-[#1e2b6d] text-center mb-8">
                   {pendingVerification ? "Check your inbox" : "Sign Up"}
                </h2>
                
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {!pendingVerification ? (
                  <form className="space-y-6" onSubmit={handleSubmit}>
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
                          </div>
                          <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1e2b6d]/40 group-focus-within:text-[#1e2b6d] transition-colors">
                              <Lock className="h-5 w-5" />
                            </span>
                            <input 
                              className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-[#1e2b6d] transition-all outline-none text-sm font-medium" 
                              id="password" 
                              name="password" 
                              placeholder="Create a password" 
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              minLength={8}
                            />
                             <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1e2b6d] transition-colors"
                              >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                          </div>
                          <p className="text-xs text-slate-500 mt-2 ml-1">Must be at least 8 characters long</p>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full py-4 bg-[#1e2b6d] hover:bg-[#1e2b6d]/90 text-white font-bold rounded-xl shadow-lg shadow-[#1e2b6d]/20 transform hover:-translate-y-1 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isLoading ? "Creating account..." : "Create Account"}
                    </button>
                    
                    <div className="text-center mt-4">
                        <Link href="/login" className="text-sm font-bold text-[#1e2b6d] hover:underline">
                            Already have an account? Log in
                        </Link>
                    </div>
                  </form>
                ) : (
                  <form className="space-y-6" onSubmit={onPressVerify}>
                    <div className="space-y-4">
                        <div className="text-center">
                            <p className="text-sm text-slate-600 mb-4">
                                Enter the verification code sent to <span className="font-bold text-[#1e2b6d]">{email}</span>
                            </p>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-[#1e2b6d] mb-2" htmlFor="code">Verification Code</label>
                          <input 
                              className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-[#1e2b6d] transition-all outline-none text-center text-2xl font-bold tracking-widest text-[#1e2b6d]" 
                              id="code" 
                              name="code" 
                              placeholder="000000" 
                              value={code}
                              onChange={(e) => setCode(e.target.value)}
                              required
                            />
                        </div>
                    </div>
                     <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full py-4 bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-bold rounded-xl shadow-lg shadow-[#22c55e]/20 transform hover:-translate-y-1 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isLoading ? "Verifying..." : "Verify & Sign In"}
                    </button>
                  </form>
                )}
              </div>
            </div>
        </div>

        <div className="mt-8 text-center">
           <p className="text-xs font-medium text-slate-500">© 2024 Bayhood Preparatory School. All rights reserved.</p>
        </div>

      </div>
    </div>
  )
}