"use client"

import Link from "next/link"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="mb-8 flex flex-col items-center gap-8">
        <div className="relative flex h-56 w-56 items-center justify-center rounded-full bg-[#FFF4BF]">
          <div className="absolute -left-6 -top-6 h-10 w-10 rounded-2xl bg-[#FFE27A] shadow-sm" />
          <div className="absolute -right-4 bottom-6 h-7 w-7 rounded-full bg-[#FFE27A]" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-md">
            <Search className="h-16 w-16 text-[#1E2B3A]" strokeWidth={2.5} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#F4B400]">404 error</p>
          <h1 className="mt-3 text-2xl font-extrabold leading-snug text-[#1E2B3A] md:text-3xl">
            Oops! We&apos;re playing <span className="text-[#F4B400]">hide</span>{" "}
            <span className="text-[#F4B400]">and seek</span>,<br className="hidden md:block" />
            but we can&apos;t find this page.
          </h1>
          <p className="mt-4 max-w-md text-sm text-[#4F5B6A] md:text-base">
            It looks like this page is hiding from us. Let&apos;s get you back to the classroom so you can keep
            learning.
          </p>
        </div>
      </div>
      <Card className="w-full max-w-md border-none bg-[#FFFDF5] shadow-md backdrop-blur">
        <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
          <div className="text-left">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#F4B400]">
              Bayhood Preparatory School
            </p>
            <p className="text-sm text-[#1E2B3A]">Ready to jump back in?</p>
          </div>
          <div className="flex w-full justify-end sm:w-auto">
            <Button asChild size="sm" variant="outline" className="border-[#F4B400]/40 text-[#1E2B3A]">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
