"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  CalendarCheck, 
  LogOut,
  Menu,
  X,
  GraduationCap,
  ClipboardList
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useClerk } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: GraduationCap, label: "Results", href: "/admin/results/new" }, 
  { icon: Users, label: "Pupils", href: "/admin/pupils" },
  { icon: FileText, label: "Classes", href: "/admin/classes" },
  { icon: CalendarCheck, label: "Attendance", href: "/admin/attendance" },
  { icon: ClipboardList, label: "Daily Reports", href: "/admin/daily-reports" },
  { icon: FileText, label: "Staff Loan", href: "/admin/loan" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

export default function AdminSidebar({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) {
  const pathname = usePathname()
  const { signOut } = useClerk()

  return (
    <>
      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed top-20 left-0 z-40 h-[calc(100vh-80px)] w-64 bg-white border-r transition-transform duration-300 ease-in-out md:translate-x-0 overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col min-h-full">
          {/* Navigation */}
          <nav className="flex-1 py-6 px-4 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => signOut({ redirectUrl: "/" })}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
