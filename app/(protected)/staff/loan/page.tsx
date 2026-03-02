"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { useClerk, useUser } from "@clerk/nextjs"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Banknote, Check, ChevronDown, Clock, Home, LogOut, Plus, User, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

type CurrentUser = {
  role: string
  email?: string
  classId?: string
}

type LoanRequest = {
  id: string
  staffEmail: string
  amount: number
  reason: string
  repaymentPlan: string
  status: "Pending" | "Approved" | "Rejected"
  createdAt: string
  adminComment?: string
}

const LOAN_REQUESTS_KEY = "staffLoanRequests"

export default function StaffLoanPage() {
  const { signOut } = useClerk();
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  
  const currentUser = useMemo(() => {
    if (!user) return null
    return {
      role: (user.publicMetadata.role as string) || "staff",
      email: user.primaryEmailAddress?.emailAddress,
      classId: (user.publicMetadata.classId as string)
    }
  }, [user])

  const [loanRequests, setLoanRequests] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Form State
  const [amount, setAmount] = useState<string>("")
  const [reason, setReason] = useState("")
  const [repaymentPlan, setRepaymentPlan] = useState("")

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/login?type=staff")
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (currentUser?.email) {
      fetchLoans()
    }
  }, [currentUser])

  const fetchLoans = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/staff/loan?email=${currentUser?.email}`)
      if (res.ok) {
        const data = await res.json()
        setLoanRequests(data)
      }
    } catch (e) {
      console.error("Failed to fetch loans", e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return
    setIsSubmitting(true)
    
    try {
        const res = await fetch("/api/staff/loan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: currentUser.email,
                amount: parseFloat(amount),
                reason,
                repaymentPlan
            })
        })

        if (res.ok) {
            alert("Loan request submitted successfully!")
            setIsDialogOpen(false)
            setAmount("")
            setReason("")
            setRepaymentPlan("")
            fetchLoans() // Refresh
        } else {
            alert("Failed to submit loan request")
        }
    } catch (e) {
        console.error("Failed to submit loan", e)
        alert("Failed to submit loan request")
    } finally {
        setIsSubmitting(false)
    }
  }

  const myRequests = loanRequests

  const handleLogout = () => { signOut(() => { router.push("/login") }) }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/staff/dashboard" className="flex items-center gap-2 font-semibold">
            <Image
              src="/logo.jpg"
              alt="Bayhood Preparatory School logo"
              width={220}
              height={66}
              className="h-14 w-auto"
            />
          </Link>
        </div>
        <div className="flex-1"></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="relative h-8 flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline-block">{currentUser?.email || "Staff Account"}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/staff/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Loan Management</h1>
              <p className="text-muted-foreground">Apply for loans and track your application status.</p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Loan Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Loan</DialogTitle>
                <DialogDescription>Enter the details for your loan request.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Loan Amount (₦)</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    min="1"
                    placeholder="e.g. 50000"
                    required 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="repayment">Repayment Plan</Label>
                  <Input 
                    id="repayment" 
                    placeholder="e.g. Deduct ₦10,000 from salary for 5 months" 
                    required 
                    value={repaymentPlan}
                    onChange={(e) => setRepaymentPlan(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Loan</Label>
                  <Textarea 
                    id="reason" 
                    placeholder="Briefly explain why you need this loan..." 
                    required 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {myRequests.filter(r => r.status === "Pending").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved (This Year)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                 {myRequests.filter(r => r.status === "Approved").length}
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                 {myRequests.filter(r => r.status === "Rejected").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Loan History</CardTitle>
            <CardDescription>A history of all your loan applications.</CardDescription>
          </CardHeader>
          <CardContent>
            {myRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No loan requests found. Apply for one to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date Requested</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Repayment Plan</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Admin Comment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">
                        ₦{req.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={req.repaymentPlan}>
                         {req.repaymentPlan}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={req.reason}>
                        {req.reason}
                      </TableCell>
                      <TableCell>
                         <Badge 
                           className={
                             req.status === "Approved" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                             req.status === "Rejected" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                             "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                           }
                         >
                           {req.status}
                         </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground italic">
                        {req.adminComment || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
