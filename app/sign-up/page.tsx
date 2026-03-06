"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSignUp, useSignIn, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { AtSign, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEffect } from "react"

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn()
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  
  useEffect(() => {
    if (isSignedIn && user && isLoaded) {
        // Already signed in, redirect
        const role = (user.publicMetadata as any)?.role
        const email = user.primaryEmailAddress?.emailAddress || ""
        if (role === 'org:admin' || email.toLowerCase().includes("admin") || email.toLowerCase().includes("anjeesax")) {
           router.replace("/admin/dashboard")
       } else if (role === 'org:staff') {
           router.replace("/staff/dashboard")
       } else {
           router.replace("/parent/dashboard")
       }
    }
  }, [isSignedIn, user, router, isLoaded])

  if (isSignedIn || (isLoaded && isSignedIn)) {
      return (
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
              <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                  <p className="text-muted-foreground">Redirecting to dashboard...</p>
              </div>
          </div>
      )
  }
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [mode, setMode] = useState<"signup" | "activate">("signup")

  // Form submit to start sign up
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded || !isSignInLoaded) return

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
      setMode("signup")
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      const errors = err.errors || []
      const errorMsg = errors[0]?.longMessage || errors[0]?.message || ""
      
      if (errorMsg.includes("already signed in") || errorMsg.includes("session")) {
          // If already signed in, we should redirect
          router.replace("/admin/dashboard") // default, others handled by useEffect
      } else if (errorMsg.includes("already exists") || errorMsg.includes("form_identifier_exists") || errorMsg.includes("That email address is taken")) {
          // If user exists, try to switch to sign-in mode (passwordless via email code)
          try {
              // Attempt to initiate sign-in flow
              const si = await signIn.create({ identifier: email })
              
              if (si.status === "needs_first_factor") {
                   const factors = si.supportedFirstFactors as any[] || [];
                   const emailFactor = factors.find((f: any) => f.strategy === "email_code");
                   
                   if (emailFactor && emailFactor.emailAddressId) {
                        await signIn.prepareFirstFactor({ strategy: "email_code", emailAddressId: emailFactor.emailAddressId })
                        setPendingVerification(true)
                        setMode("activate")
                        setError("") 
                        // Inform user what's happening
                        alert("Account found! We sent a verification code to your email to log you in.")
                   } else {
                        // Maybe only password is enabled?
                        setError("Account exists. Please log in with your password.")
                        setTimeout(() => router.push("/login"), 2000)
                   }
               } else if (si.status === "complete") {
                  // Already logged in? weird but handle it
                  await setActive({ session: si.createdSessionId })
                  router.push("/admin/dashboard") // default redirect
               } else {
                  setError("This account already exists. Please log in.")
                  setTimeout(() => router.push("/login"), 2000)
              }
           } catch (siErr: any) {
               console.error("Sign In Create Error:", siErr)
               // Fallback: If sign-in create fails (e.g. rate limit or other), just tell them to login
               setError("Account already exists. Redirecting to login...")
               setTimeout(() => router.push("/login"), 1500)
           }
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
    if (!isLoaded || !isSignInLoaded) return

    setIsLoading(true)
    setError("")

    try {
      if (mode === "signup") {
          const completeSignUp = await signUp.attemptEmailAddressVerification({
            code,
          })
          if (completeSignUp.status === "complete") {
            await setActive({ session: completeSignUp.createdSessionId })
            // Redirect based on metadata if available, or fallback
            // We can't easily check metadata here on the client immediately without user object
            // But we can redirect to login page logic or dashboard
            router.push("/login") 
          } else {
             setError("Verification incomplete. Please try again.")
          }
      } else {
          // Activation mode (Sign In with Code)
          const result = await signIn.attemptFirstFactor({
              strategy: "email_code",
              code,
          })
          
          if (result.status === "complete") {
              await setSignInActive({ session: result.createdSessionId })
              
              // Now we should probably Update Password since they didn't have one?
              // Or just let them in.
              // For better UX, we should update password.
              try {
                  const user = result.userData
                  // We can't update password here easily without current password?
                  // Actually, if they are signed in, they can set a password.
                  // But let's just redirect them for now.
                  router.push("/login")
              } catch {
                  router.push("/login")
              }
          } else {
              setError("Verification failed.")
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#eff6ff] vibrant-pattern overflow-x-hidden font-sans">
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
            <h1 className="text-4xl font-bold text-[#1e2b6d] tracking-tight">
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

      {/* Footer Text */}
      <div className="fixed bottom-6 w-full text-center z-10 pointer-events-none">
          <p className="text-xs text-slate-500 font-medium bg-white/40 px-6 py-2 rounded-full backdrop-blur-sm border border-white/50 w-fit mx-auto">
              © {new Date().getFullYear()} Bayhood Preparatory School. All rights reserved.
          </p>
      </div>

      </div>
    </div>
  )
}
