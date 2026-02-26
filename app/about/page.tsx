import Link from "next/link"
import { ArrowRight, GraduationCap, Heart, Lightbulb, Palette } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
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
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
            About
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
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Little Learners</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Nurturing young minds and building a strong foundation for lifelong learning
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Little Learners was founded in 2010 with a simple mission: to provide high-quality early childhood
                  education in a nurturing, stimulating environment. What began as a small nursery with just 15 children
                  has grown into a respected institution serving over 200 families in our community.
                </p>
                <p className="text-muted-foreground mb-4">
                  Our founder, Mrs. Elizabeth Thompson, a veteran educator with over 25 years of experience, established
                  Little Learners based on her belief that the early years are the most crucial for developing a child's
                  potential. Her vision was to create a place where children could learn through play, exploration, and
                  discovery.
                </p>
                <p className="text-muted-foreground">
                  Today, Little Learners continues to uphold these founding principles while incorporating modern
                  educational approaches and technology to prepare our pupils for the future.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Children playing and learning in a classroom"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight">Our Philosophy</h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                We believe every child is unique and deserves an education tailored to their individual needs
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Lightbulb className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Child-Centered Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    We place the child at the center of the learning process, recognizing their natural curiosity and
                    desire to explore. Our curriculum is designed to follow children's interests while guiding them
                    toward key developmental milestones.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Heart className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Nurturing Environment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    We create a warm, loving atmosphere where children feel safe, valued, and supported. Our teachers
                    build strong relationships with each child, fostering emotional security that is essential for
                    learning and growth.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Palette className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Creative Expression</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    We encourage children to express themselves through art, music, movement, and dramatic play. These
                    creative activities develop cognitive skills, fine motor coordination, and emotional intelligence.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight">Our Team</h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Dedicated professionals committed to providing the best care and education
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Mrs. Elizabeth Thompson"
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <CardTitle className="text-center">Mrs. Elizabeth Thompson</CardTitle>
                  <CardDescription className="text-center">Founder & Director</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p>
                    With over 25 years in early childhood education, Mrs. Thompson brings a wealth of experience and a
                    passion for nurturing young minds.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Damisa Yetunde Halimat"
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <CardTitle className="text-center">Damisa Yetunde Halimat</CardTitle>
                  <CardDescription className="text-center">Head Teacher, Nursery 2</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p>
                    Mr. Wilson specializes in early literacy and has been with Little Learners for 8 years, creating
                    engaging learning experiences.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Omotosho Mary"
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <CardTitle className="text-center">Omotosho Mary</CardTitle>
                  <CardDescription className="text-center">Head Teacher, Nursery 1</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p>
                    With a background in child psychology, Ms. Williams creates a nurturing environment that supports
                    emotional and social development.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-10">
              <Button asChild>
                <Link href="/contact">
                  Contact Our Team <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Our facilities with playground and classrooms"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Our Facilities</h2>
                <p className="text-muted-foreground mb-4">
                  Little Learners is housed in a purpose-built facility designed with children's needs in mind. Our
                  classrooms are bright, spacious, and equipped with age-appropriate learning materials and toys.
                </p>
                <p className="text-muted-foreground mb-4">
                  Our outdoor play area features safe, modern equipment that encourages physical development and
                  imaginative play. We also have dedicated spaces for art, music, and quiet reading.
                </p>
                <p className="text-muted-foreground mb-6">
                  Safety is our top priority, with secure entry systems, CCTV monitoring, and staff trained in first aid
                  and emergency procedures.
                </p>
                <Button asChild variant="outline">
                  <Link href="/programs">
                    Explore Our Programs <ArrowRight className="ml-2 h-4 w-4" />
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
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About
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
          <div className="text-sm text-muted-foreground">© 2023 Little Learners. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
