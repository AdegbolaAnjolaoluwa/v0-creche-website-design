"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSignIn } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Lock, Mail, User, School } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const parentLoginSchema = z.object({
  pupilId: z.string().min(1, "Pupil ID or Email is required"),
  password: z.string().min(1, "Password is required"),
})

type ParentLoginFormValues = z.infer<typeof parentLoginSchema>

export function HomeLoginSection() {
  const router = useRouter()
  const { isLoaded: isClerkLoaded, signIn, setActive } = useSignIn()
  
  const [activeTab, setActiveTab] = useState("staff")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // -- PARENT FORM --
  const {
    register: registerParent,
    handleSubmit: handleSubmitParent,
    formState: { errors: parentErrors },
  } = useForm<ParentLoginFormValues>({
    resolver: zodResolver(parentLoginSchema),
  })

  const onParentSubmit = async (data: ParentLoginFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/parent-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pupilId: data.pupilId,
          password: data.password,
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Login failed")
      }

      router.push("/parent/dashboard")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // -- STAFF FORM --
  const [staffEmail, setStaffEmail] = useState("")
  const [staffPassword, setStaffPassword] = useState("")

  const onStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isClerkLoaded) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn.create({
        identifier: staffEmail,
        password: staffPassword,
      })

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        router.push("/staff/dashboard")
        router.refresh()
      } else {
        console.error("Clerk login incomplete", result)
        setError("Login verification needed. Please check your email.")
      }
    } catch (err: any) {
      console.error("Clerk login error", err)
      setError(err.errors?.[0]?.message || "Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto relative z-10">
      {/* Background Pattern Elements (Simulated) */}
      <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
          <div className={`absolute top-0 left-0 w-full h-full ${activeTab === 'staff' ? 'bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:20px_20px]' : 'bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]'}`}></div>
      </div>

      <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl border shadow-2xl transition-all duration-500 ease-in-out">
        {/* Logo Icon */}
        <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center border-2 border-primary/10">
                <School className={`h-8 w-8 ${activeTab === 'staff' ? 'text-green-600' : 'text-blue-600'}`} />
            </div>
        </div>

        <Tabs defaultValue="staff" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger 
                value="staff" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-medium transition-all"
            >
                Staff Portal
            </TabsTrigger>
            <TabsTrigger 
                value="parent" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-medium transition-all"
            >
                Parent Portal
            </TabsTrigger>
          </TabsList>

          {error && (
            <Alert variant="destructive" className="mb-6 rounded-xl border-red-200 bg-red-50 text-red-800">
              <AlertTitle className="font-bold">Access Denied</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* STAFF LOGIN CONTENT */}
          <TabsContent value="staff" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2 mb-6">
                <h2 className="text-2xl font-bold text-[#1e293b]">Staff & Admin Portal</h2>
                <p className="text-sm text-muted-foreground">Secure access for school management</p>
            </div>

            <form onSubmit={onStaffSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="staff-email" className="text-sm font-semibold text-gray-700">Staff Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="staff-email"
                    type="email"
                    placeholder="staff@bayhood.com"
                    className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-xl transition-all"
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="staff-password" className="text-sm font-semibold text-gray-700">Password</Label>
                  <a href="#" className="text-xs text-green-600 hover:text-green-700 font-medium hover:underline">Forgot Password?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="staff-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-xl transition-all"
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button className="w-full h-12 text-base font-semibold bg-[#1e293b] hover:bg-[#0f172a] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In to Portal →"
                )}
              </Button>

              <div className="pt-4 text-center">
                  <p className="text-xs text-gray-400 font-medium">© 2024 Bayhood Preparatory School. Authorized Staff Only.</p>
              </div>
            </form>
          </TabsContent>

          {/* PARENT LOGIN CONTENT */}
          <TabsContent value="parent" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2 mb-6">
                <h2 className="text-2xl font-bold text-[#1e293b]">Parent Portal Login</h2>
                <p className="text-sm text-muted-foreground">Connecting home and school life</p>
            </div>

            <form onSubmit={handleSubmitParent(onParentSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="pupil-id" className="text-sm font-semibold text-gray-700">Parent Email</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    id="pupil-id"
                    placeholder="email@example.com"
                    className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-600 rounded-xl transition-all"
                    {...registerParent("pupilId")}
                  />
                </div>
                {parentErrors.pupilId && (
                  <p className="text-xs text-red-500 font-medium">{parentErrors.pupilId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="parent-password" className="text-sm font-semibold text-gray-700">Password</Label>
                  <a href="#" className="text-xs text-green-600 hover:text-green-700 font-medium hover:underline">Forgot Password?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    id="parent-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-600 rounded-xl transition-all"
                    {...registerParent("password")}
                  />
                </div>
                {parentErrors.password && (
                  <p className="text-xs text-red-500 font-medium">{parentErrors.password.message}</p>
                )}
              </div>

              <Button className="w-full h-12 text-base font-semibold bg-[#1e293b] hover:bg-[#0f172a] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Sign In to Parent Portal →"
                )}
              </Button>

              <div className="pt-4 text-center space-y-2">
                  <p className="text-sm text-gray-600">New to Bayhood? <a href="#" className="font-bold text-blue-600 hover:underline">Register here</a></p>
                  <p className="text-xs text-gray-400 font-medium">© 2024 Bayhood Preparatory School. All rights reserved.</p>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
