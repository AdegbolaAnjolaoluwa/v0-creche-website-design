import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"

export default function TermsPage() {
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
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">
              These Terms of Service describe the rules and conditions for using the Bayhood Preparatory School website
              and online services. By accessing or using this site, you agree to these terms.
            </p>
            <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">1. Use of the Website</h2>
                <p>
                  Our website is provided to share information about Bayhood Preparatory School and to give parents and
                  staff access to useful tools. You agree to use the site only for lawful purposes and in a way that
                  does not harm the school, other users, or the website.
                </p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">2. Accounts and Access</h2>
                <p>
                  Certain areas of the site, including the parent and staff portals, require an account. You are
                  responsible for keeping your login details confidential and for all activity that happens under your
                  account. If you believe your account has been compromised, please inform the school immediately.
                </p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">3. School Information</h2>
                <p>
                  We do our best to keep information on this site accurate and up to date, but some details (including
                  programs, fees, and policies) may change from time to time. The school reserves the right to update or
                  change content without prior notice.
                </p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">4. Intellectual Property</h2>
                <p>
                  All content on this site, including text, images, and branding, belongs to Bayhood Preparatory School
                  or is used with permission. You may not copy, redistribute, or use this content for commercial
                  purposes without written consent from the school.
                </p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">5. Third-Party Services</h2>
                <p>
                  Our website may link to third-party services or tools. These are provided for convenience only. We are
                  not responsible for the content, security, or privacy practices of external websites or services.
                </p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">6. Limitation of Liability</h2>
                <p>
                  The website is provided on an “as is” and “as available” basis. While we aim to keep the site running
                  smoothly, we do not guarantee that it will be free from errors or interruptions. Bayhood Preparatory
                  School is not liable for any loss or damage arising from your use of the site.
                </p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">7. Changes to These Terms</h2>
                <p>
                  We may update these Terms of Service from time to time. When we make changes, we will update the date
                  at the bottom of this page. Continued use of the website after changes are posted means you accept the
                  updated terms.
                </p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">8. Contact</h2>
                <p>
                  If you have any questions about these terms, please contact the school administration using the
                  details on the contact page.
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
