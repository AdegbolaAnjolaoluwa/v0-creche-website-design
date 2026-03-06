"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"

interface SplashScreenProps {
  onComplete?: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onComplete) onComplete()
    }, 2500)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white font-sans">
      <div className="animate-in fade-in zoom-in duration-700 flex flex-col items-center">
        <div className="relative mb-8 p-6 bg-white rounded-full shadow-2xl ring-4 ring-[#1e2b6d]/5 animate-bounce-slow">
          <Image
            src="/logo.jpg"
            alt="Bayhood Preparatory School"
            width={200}
            height={200}
            className="h-32 w-auto object-contain"
            priority
          />
        </div>
        
        <h1 className="text-3xl font-bold text-[#1e2b6d] tracking-tight mb-2 animate-pulse">
          Bayhood Preparatory School
        </h1>
        <p className="text-slate-500 font-medium text-lg animate-pulse delay-100">
          Welcome back!
        </p>
        
        <div className="mt-12">
          <Loader2 className="h-8 w-8 text-[#facc15] animate-spin" />
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-[#eff6ff] opacity-50">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#1e2b6d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]"></div>
      </div>
    </div>
  )
}
