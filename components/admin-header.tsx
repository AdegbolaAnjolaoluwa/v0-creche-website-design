"use client"

import { UserButton } from "@clerk/nextjs"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminHeaderProps {
  onMenuClick: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="Bayhood Preparatory School Logo"
            width={180}
            height={54}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="hidden text-sm font-medium text-slate-600 md:inline-block">
            Admin User
          </span>
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10 border-2 border-primary/10",
                userButtonPopoverCard: "shadow-xl border border-slate-100 rounded-xl"
              }
            }}
          />
        </div>
      </div>
    </header>
  )
}
