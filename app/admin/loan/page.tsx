"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { useClerk, useUser } from "@clerk/nextjs"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, ChevronDown, Clock, Filter, Home, LogOut, Search, User, X } from "lucide-react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

type CurrentUser = {
  role: string
  email?: string
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

export default function AdminLoanPage() {
  const { signOut } = useClerk()
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  const currentUser = useMemo(() => {
    if (!user) return null
    return {
      role: (user.publicMetadata.role as string) || "admin",
      email: user.primaryEmailAddress?.emailAddress,
    }
  }, [user])

  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  
  // Action Dialog State
  const [selectedRequest, setSelectedRequest] = useState<LoanRequest | null>(null)
  const [adminComment, setAdminComment] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"Approve" | "Reject" | null>(null)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/login?type=admin")
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem(LOAN_REQUESTS_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as LoanRequest[]
        setLoanRequests(parsed)
      } catch {
        setLoanRequests([])
      }
    }
  }, [])

  const filteredRequests = loanRequests
    .filter((req) => {
      const matchesStatus = filterStatus === "all" || req.status === filterStatus
      const matchesSearch = req.staffEmail.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesStatus && matchesSearch
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const handleAction = (request: LoanRequest, type: "Approve" | "Reject") => {
    setSelectedRequest(request)
    setActionType(type)
    setAdminComment("")
    setIsDialogOpen(true)
  }

  const confirmAction = () => {
    if (!selectedRequest || !actionType) return

    const updatedRequests = loanRequests.map(req => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          status: actionType === "Approve" ? "Approved" : "Rejected",
          adminComment: adminComment
        } as LoanRequest
      }
      return req
    })

    setLoanRequests(updatedRequests)
    window.localStorage.setItem(LOAN_REQUESTS_KEY, JSON.stringify(updatedRequests))
    setIsDialogOpen(false)
    setSelectedRequest(null)
    setActionType(null)
  }

  const handleLogout = () => { signOut(() => { router.push("/login") }) }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
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
              <span className="hidden md:inline-block">Admin User</span>
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
              <Link href="/admin/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Staff Loan Management</h1>
              <p className="text-muted-foreground">Review and manage staff loan requests.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
             <Search className="h-4 w-4 text-muted-foreground" />
             <Input 
               placeholder="Search by email..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="max-w-sm"
             />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Loan Requests</CardTitle>
            <CardDescription>
              {filteredRequests.length} request(s) found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredRequests.length === 0 ? (
               <div className="text-center py-12 text-muted-foreground">
                 No loan requests found matching your criteria.
               </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Email</TableHead>
                    <TableHead>Date Requested</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Repayment Plan</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.staffEmail}</TableCell>
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
                      <TableCell className="text-right">
                        {req.status === "Pending" ? (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleAction(req, "Approve")}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleAction(req, "Reject")}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {req.status === "Approved" ? "Approved" : "Rejected"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{actionType} Request</DialogTitle>
              <DialogDescription>
                Are you sure you want to {actionType?.toLowerCase()} this loan request from {selectedRequest?.staffEmail}?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label>Admin Comment (Optional)</Label>
              <Textarea 
                value={adminComment} 
                onChange={(e) => setAdminComment(e.target.value)} 
                placeholder="Add a note..."
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button 
                variant={actionType === "Reject" ? "destructive" : "default"}
                onClick={confirmAction}
              >
                Confirm {actionType}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
