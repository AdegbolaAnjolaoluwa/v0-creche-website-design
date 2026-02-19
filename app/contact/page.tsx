import Link from "next/link"
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-6 w-6" />
          <span>Little Learners</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            About
          </Link>
          <Link
            href="/programs"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Programs
          </Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
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
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Contact Us</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  We'd love to hear from you. Get in touch with our team.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Get In Touch</h2>
                <p className="text-muted-foreground mb-6">
                  We're here to answer any questions you may have about our programs, enrollment process, or facilities.
                  Please fill out the form and we'll get back to you as soon as possible.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-sm text-muted-foreground">123 Learning Lane, Education City, EC 12345</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-sm text-muted-foreground">(123) 456-7890</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm text-muted-foreground">info@littlelearners.edu</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="font-medium mb-4">Hours of Operation</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Monday - Friday</span>
                      <span className="text-muted-foreground">7:30 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Saturday</span>
                      <span className="text-muted-foreground">9:00 AM - 1:00 PM (Office Only)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sunday</span>
                      <span className="text-muted-foreground">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you within 24 hours.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First name</Label>
                          <Input id="first-name" placeholder="Enter your first name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last name</Label>
                          <Input id="last-name" placeholder="Enter your last name" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Enter your email" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" placeholder="Enter your phone number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inquiry-type">Inquiry Type</Label>
                        <Select>
                          <SelectTrigger id="inquiry-type">
                            <SelectValue placeholder="Select inquiry type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enrollment">Enrollment Information</SelectItem>
                            <SelectItem value="tour">Schedule a Tour</SelectItem>
                            <SelectItem value="program">Program Questions</SelectItem>
                            <SelectItem value="employment">Employment Opportunities</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Enter your message" rows={5} />
                      </div>
                      <Button type="submit" className="w-full">
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Find answers to common questions about our programs and enrollment
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">What are your operating hours?</h3>
                <p className="text-muted-foreground">
                  We are open Monday through Friday from 7:30 AM to 6:00 PM. Our administrative office is also open on
                  Saturdays from 9:00 AM to 1:00 PM.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">How do I enroll my child?</h3>
                <p className="text-muted-foreground">
                  The enrollment process begins with submitting an application form, followed by a tour of our facility
                  and an interview. Once accepted, we'll provide a registration packet with all necessary paperwork.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">What is your teacher-to-child ratio?</h3>
                <p className="text-muted-foreground">
                  Our teacher-to-child ratios exceed regulatory requirements: 1:3 for Creche (3 months-2 years), 1:6 for
                  Nursery 1 (2-3 years), and 1:8 for Nursery 2 (3-4 years).
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Do you provide meals?</h3>
                <p className="text-muted-foreground">
                  Yes, we provide nutritious breakfast, lunch, and afternoon snacks prepared fresh daily in our kitchen.
                  We accommodate dietary restrictions and allergies.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">What is your illness policy?</h3>
                <p className="text-muted-foreground">
                  Children should not attend school if they have a fever, vomiting, diarrhea, or any contagious
                  condition. Children must be symptom-free for 24 hours before returning to school.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Do you offer financial assistance?</h3>
                <p className="text-muted-foreground">
                  We offer a limited number of scholarships based on financial need. Please contact our administrative
                  office for more information about our financial assistance program.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-muted/40">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <GraduationCap className="h-6 w-6" />
              <span>Little Learners</span>
            </Link>
            <p className="text-sm text-muted-foreground">Nurturing young minds since 2010</p>
          </div>
          <nav className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              About
            </Link>
            <Link
              href="/programs"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Programs
            </Link>
            <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="text-sm text-muted-foreground">© 2023 Little Learners. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

