import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"

export default function CookiesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image
            src="/logo.jpg"
            alt="Bayhood Preparatory School logo"
            width={220}
            height={66}
            className="h-14 w-auto"
          />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Home
          </Link>
          <Link
            href="/programs"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Programs
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Contact
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Log in
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6 max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Cookies Policy</h1>
            <p className="text-muted-foreground mb-8">
              This Cookies Policy explains how Bayhood Preparatory School uses cookies and similar technologies on this
              website.
            </p>
            <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">1. What Are Cookies?</h2>
                <p>
                  Cookies are small text files stored on your device when you visit a website. They help the site
                  remember information about your visit, such as your preferences and login status, so that your
                  experience is more convenient and consistent.
                </p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">2. How We Use Cookies</h2>
                <p>We may use cookies to:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Keep you signed in to the parent or staff portal.</li>
                  <li>Remember your preferences, such as selected tabs or settings.</li>
                  <li>Understand how the website is used so we can improve its design and content.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">3. Types of Cookies</h2>
                <p>We may use the following types of cookies:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>
                    Essential cookies that are necessary for the website to function, such as those used for security
                    and login.
                  </li>
                  <li>
                    Preference cookies that remember your choices, such as language or display settings, where
                    applicable.
                  </li>
                  <li>
                    Analytics cookies that help us understand how visitors use the site, often in an aggregated and
                    anonymous way.
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">4. Managing Cookies</h2>
                <p>
                  Most web browsers allow you to control cookies through their settings, including blocking or deleting
                  them. If you choose to disable certain cookies, some parts of the website or portal may not work
                  properly.
                </p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">5. Third-Party Cookies</h2>
                <p>
                  Some cookies may be set by third-party services that we use, such as analytics or embedded content.
                  These third parties have their own privacy and cookies policies, which we encourage you to review.
                </p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">6. Changes to This Policy</h2>
                <p>
                  We may update this Cookies Policy from time to time. We will update the date below when changes are
                  made. Continued use of the website after changes are posted means you accept the updated policy.
                </p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">7. Contact</h2>
                <p>
                  If you have any questions about this Cookies Policy, please contact us using the details provided on
                  the contact page.
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-4">Last updated: {new Date().getFullYear()}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
