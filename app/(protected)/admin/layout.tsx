"use client"

import { useState } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { Fredoka, Inter } from "next/font/google"

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={`min-h-screen bg-gray-50/50 font-sans ${inter.variable} ${fredoka.variable}`}>
      <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex pt-20">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 md:pl-64 min-h-[calc(100vh-80px)] transition-all duration-300 ease-in-out">
          <div className="container mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}