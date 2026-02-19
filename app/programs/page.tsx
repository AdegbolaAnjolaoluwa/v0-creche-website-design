import Link from "next/link"
import { ArrowRight, BookOpen, GraduationCap, Music, Palette, Shapes, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProgramsPage() {
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
          <Link href="/programs" className="text-sm font-medium transition-colors hover:text-primary">
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
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Programs</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Comprehensive early childhood education designed to nurture and develop young minds
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Our Curriculum</h2>
                <p className="text-muted-foreground mb-4">
                  At Little Learners, we follow a play-based curriculum that integrates elements from various
                  educational philosophies, including Montessori, Reggio Emilia, and traditional approaches. This
                  balanced method ensures children develop holistically across all developmental domains.
                </p>
                <p className="text-muted-foreground mb-4">
                  Our curriculum is designed to be age-appropriate, challenging, and engaging. We focus on developing:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
                  <li>Cognitive skills through problem-solving and critical thinking activities</li>
                  <li>Language and literacy through stories, conversations, and pre-reading activities</li>
                  <li>Social and emotional skills through group play and guided interactions</li>
                  <li>Physical development through both fine and gross motor activities</li>
                  <li>Creative expression through art, music, and dramatic play</li>
                </ul>
                <Button asChild>
                  <Link href="/contact">
                    Schedule a Visit <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Children engaged in learning activities"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight">Our Classes</h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Age-appropriate programs designed to meet the developmental needs of each stage
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <Shapes className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Creche</CardTitle>
                  <CardDescription>Ages 3 months - 2 years</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Our creche program provides a nurturing, stimulating environment for our youngest learners. We focus
                    on:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Sensory exploration and development</li>
                    <li>Motor skills development</li>
                    <li>Language acquisition through songs and stories</li>
                    <li>Social interaction with caregivers and peers</li>
                    <li>Establishing routines for eating, sleeping, and play</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact?program=creche">Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <Palette className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Nursery 1</CardTitle>
                  <CardDescription>Ages 2-3 years</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Nursery 1 introduces more structured learning while maintaining a play-based approach. Our program
                    includes:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Introduction to alphabets and numbers through play</li>
                    <li>Fine motor skills development with art and manipulatives</li>
                    <li>Group activities to develop social skills</li>
                    <li>Basic concepts like colors, shapes, and sizes</li>
                    <li>Music and movement activities</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact?program=nursery1">Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Nursery 2</CardTitle>
                  <CardDescription>Ages 3-4 years</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Nursery 2 prepares children for formal schooling with a balanced curriculum that includes:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Pre-reading and pre-writing activities</li>
                    <li>Basic numeracy and mathematical concepts</li>
                    <li>Science exploration and discovery</li>
                    <li>Social studies and cultural awareness</li>
                    <li>Independent work and collaborative projects</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact?program=nursery2">Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight">Enrichment Programs</h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Additional activities to enhance your child's learning experience
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <Music className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Music & Movement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Weekly sessions with a specialized music teacher, introducing children to rhythm, melody, and
                    various musical instruments.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Language Immersion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Introduction to a second language through songs, games, and everyday conversation, fostering
                    bilingual development.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 mb-2 text-primary"
                  >
                    <path d="M18 8c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4zM6 15.5C6 13.6 7.6 12 9.5 12h5c1.9 0 3.5 1.6 3.5 3.5S16.4 19 14.5 19h-5C7.6 19 6 17.4 6 15.5z"></path>
                  </svg>
                  <CardTitle>Sports & Physical Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Structured physical activities designed to develop gross motor skills, coordination, and teamwork.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 mb-2 text-primary"
                  >
                    <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7H2Z"></path>
                    <path d="M6 11V7"></path>
                    <path d="M10 11V7"></path>
                    <path d="M14 11V7"></path>
                    <path d="M18 11V7"></path>
                  </svg>
                  <CardTitle>Gardening & Nature</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Hands-on experiences with plants and nature, teaching environmental awareness and basic science
                    concepts.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Parent and teacher discussing child's progress"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Parent Partnership</h2>
                <p className="text-muted-foreground mb-4">
                  We believe that parents are a child's first and most important teachers. Our approach involves close
                  collaboration between home and school to ensure consistent support for each child's development.
                </p>
                <p className="text-muted-foreground mb-4">Our parent partnership program includes:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
                  <li>Regular parent-teacher conferences to discuss progress</li>
                  <li>Digital portfolio system to share observations and achievements</li>
                  <li>Parent workshops on child development and education</li>
                  <li>Family events and celebrations throughout the year</li>
                  <li>Parent volunteer opportunities in the classroom</li>
                </ul>
                <Button asChild>
                  <Link href="/login">
                    Parent Portal Login <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
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
            <Link href="/programs" className="text-sm font-medium transition-colors hover:text-primary">
              Programs
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </nav>
          <div className="text-sm text-muted-foreground">© 2023 Little Learners. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

