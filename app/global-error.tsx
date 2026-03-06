"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-white text-slate-900 p-6">
        <div className="max-w-md w-full rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h1 className="text-xl font-bold">Something went wrong</h1>
          <p className="text-sm text-slate-600 mt-2">
            Please refresh the page or try again. If this keeps happening, contact the administrator.
          </p>
          {error.digest ? (
            <p className="text-xs text-slate-500 mt-3">Error ID: {error.digest}</p>
          ) : null}
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 rounded-lg bg-[#1e2b6d] text-white font-semibold"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg border border-slate-200 font-semibold"
            >
              Refresh
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
