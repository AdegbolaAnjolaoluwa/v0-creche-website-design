import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
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
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">
              This Privacy Policy explains how Bayhood Preparatory School collects, uses, and protects personal
              information when you use our website and online services.
            </p>
            <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">1. Information We Collect</h2>
                <p>
                  We may collect information that you provide directly, such as contact details submitted through forms
                  or information used to log in to the parent or staff portals. We may also collect basic technical
                  information like your browser type, device, and pages visited.
                </p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">2. How We Use Information</h2>
                <p>
                  We use personal information to operate the website, provide school-related services, communicate with
                  parents and staff, respond to enquiries, and improve our online tools. We do not sell your personal
                  information to third parties.
                </p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">3. Parent and Pupil Data</h2>
                <p>
                  Access to pupil information through the portal is restricted to authorised users. We take reasonable
                  steps to protect this data and limit access to staff and parents who need it for educational purposes.
                </p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">4. Cookies and Similar Technologies</h2>
                <p>
                  We may use cookies and similar technologies to remember your preferences, keep you signed in, and
                  understand how the site is used. For more detail, please see our Cookies Policy.
                </p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">5. Sharing of Information</h2>
                <p>
                  We may share information with trusted service providers who help us operate the website or deliver
                  school services, for example hosting, analytics, or communication tools. These providers are required
                  to protect your information and use it only for the services they provide to the school.
                </p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">6. Data Security</h2>
                <p>
                  We use reasonable technical and organisational measures to protect personal information. However, no
                  method of transmission or storage is completely secure, so we cannot guarantee absolute security.
                </p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">7. Your Rights</h2>
                <p>
                  Depending on local laws, you may have rights to access, correct, or request deletion of your personal
                  information. To exercise these rights, please contact the school administration using the details on
                  the contact page.
                </p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">8. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will update the date below when changes are
                  made. Continued use of the website after changes are posted means you accept the updated policy.
                </p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">9. Contact</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us using the details provided on
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
