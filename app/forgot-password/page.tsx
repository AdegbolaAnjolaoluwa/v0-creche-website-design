"use client"

import * as React from "react"
import { useState } from "react"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { KeyRound, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const router = useRouter()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!isLoaded) {
    return null
  }

  async function create(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      setSuccessfulCreation(true)
      setError("")
    } catch (err: any) {
      console.error("error", err.errors[0].longMessage)
      setError(err.errors[0].longMessage)
    } finally {
      setIsLoading(false)
    }
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })

      if (result?.status === "complete") {
        if (setActive) {
          await setActive({ session: result.createdSessionId })
        }
        setComplete(true)
        setTimeout(() => {
            router.push("/")
        }, 2000)
      } else {
        console.log(result)
        setError("Something went wrong. Please try again.")
      }
    } catch (err: any) {
      console.error("error", err.errors[0].longMessage)
      setError(err.errors[0].longMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <KeyRound className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {complete ? "Password Reset!" : successfulCreation ? "Check your email" : "Forgot Password?"}
          </CardTitle>
          <CardDescription className="text-center">
            {complete 
              ? "You have successfully reset your password. Redirecting..." 
              : successfulCreation 
                ? "We've sent a verification code to your email address." 
                : "Enter your email address and we'll send you a code to reset your password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {complete ? (
            <div className="flex justify-center py-8">
              <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
            </div>
          ) : !successfulCreation ? (
            <form onSubmit={create} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  "Send Reset Code"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={reset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                 {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" asChild className="text-sm text-muted-foreground">
            <Link href="/login" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
