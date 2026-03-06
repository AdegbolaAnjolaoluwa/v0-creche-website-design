import Link from "next/link"
import Image from "next/image"
import { 
  ArrowRight, 
  BookOpen, 
  Calendar, 
  Clock, 
  GraduationCap, 
  Heart, 
  Users, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Baby, 
  Gamepad2, 
  School,
  Sprout 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="Bayhood Preparatory School Logo"
              width={180}
              height={54}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="#programs" className="text-sm font-medium hover:text-primary transition-colors">
              Programs
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link href="/login?tab=staff">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Staff Login
              </Button>
            </Link>
            <Link href="/login?tab=parent">
              <Button size="sm" className="bg-[#1e293b] hover:bg-[#0f172a] text-white">
                Parent Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#fffdf5]">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                  Nurturing Young Minds
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Where Learning Begins with <span className="text-red-500">Love</span> and <span className="text-blue-500">Care</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Bayhood Preparatory School provides a safe, nurturing environment where children can explore, learn, and grow.
                  Our dedicated staff and innovative curriculum ensure your child gets the best start in life.
                </p>
                <div className="flex flex-col gap-3 min-[400px]:flex-row pt-4">
                  <Link href="/login?tab=parent">
                    <Button size="lg" className="bg-[#1e293b] hover:bg-[#0f172a] text-white w-full min-[400px]:w-auto">
                      View Results
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#programs">
                    <Button variant="outline" size="lg" className="w-full min-[400px]:w-auto">
                      Explore Programs
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[600px] relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/hero-section.jpg"
                  fill
                  alt="Children learning in a classroom"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section id="about" className="w-full py-16 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                OUR APPROACH
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Why Choose Bayhood Preparatory School?
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                We combine play-based learning with structured activities to create a balanced educational experience.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-none shadow-lg bg-red-50/50 hover:bg-red-50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
                    <Heart className="h-6 w-6" />
                  </div>
                  <CardTitle>Nurturing Environment</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600">
                    We create a loving, supportive space where children feel safe to explore and learn about the world around them.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-blue-50/50 hover:bg-blue-50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <CardTitle>Innovative Curriculum</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600">
                    Our program balances academic foundations with creative play and social development tailored for each stage.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-green-50/50 hover:bg-green-50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4 text-green-600">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <CardTitle>Qualified Teachers</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600">
                    Our experienced educators are passionate about early childhood development and continuous professional growth.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section id="programs" className="w-full py-16 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                OUR PROGRAMS
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Educational Programs
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                We offer age-appropriate programs designed to nurture your child's development.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Creche",
                  age: "3 months - 18 months",
                  desc: "Focused on nurturing care, sensory play, and early development milestones.",
                  icon: Baby,
                  color: "text-pink-500",
                  bg: "bg-pink-100"
                },
                {
                  title: "Playgroup",
                  age: "18 months - 3 years",
                  desc: "Gentle introduction to school focused on social skills, music, and guided play.",
                  icon: Gamepad2,
                  color: "text-orange-500",
                  bg: "bg-orange-100"
                },
                {
                  title: "Preschool",
                  age: "3 - 4 years",
                  desc: "Strengthening pre-reading, writing, and early mathematics through structured play.",
                  icon: School,
                  color: "text-blue-500",
                  bg: "bg-blue-100"
                },
                {
                  title: "Nursery",
                  age: "4 - 5 years",
                  desc: "Advanced structured learning preparing children for primary education with confidence.",
                  icon: Sprout,
                  color: "text-green-500",
                  bg: "bg-green-100"
                }
              ].map((program, i) => (
                <Card key={i} className="flex flex-col border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl ${program.bg} flex items-center justify-center mb-4 ${program.color}`}>
                      <program.icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{program.title}</CardTitle>
                    <CardDescription className="mt-2 font-medium text-primary">
                      {program.age}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground mb-6">
                      {program.desc}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> 
                        {program.title === "Creche" ? "7:00 AM - 6:00 PM" : "7:00 AM - 2:00 PM"}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-6">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Track Progress Section */}
        <section className="w-full py-16 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                  RESULT MANAGEMENT
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Track Your Child's Progress with Ease
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  Our secure result management system allows parents to easily access their child's academic progress, reports, and assessments from any device.
                </p>
                
                <div className="flex gap-4 pt-4">
                  <Link href="/login?tab=parent">
                    <Button className="bg-[#1e293b] hover:bg-[#0f172a] text-white">
                      Parent Portal
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login?tab=staff">
                    <Button variant="outline">
                      Staff Login
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border">
                <h3 className="text-xl font-bold mb-6">Result Portal Features</h3>
                <p className="text-sm text-muted-foreground mb-8">
                  Access your child's academic information anytime, anywhere.
                </p>
                <ul className="space-y-4">
                  {[
                    "View current and past results instantly",
                    "Download and print professional report cards",
                    "Track learning progress over multiple terms",
                    "Receive real-time notifications for new results"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 bg-blue-100 rounded-full p-1">
                        <CheckCircle2 className="h-3 w-3 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full py-16 md:py-24 bg-[#fffdf5]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                GET IN TOUCH
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Contact Us
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-lg">
                Have questions about our programs or enrollment? We're here to help you and your child get started.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <a href="mailto:bayhoodpreperatoryschool@gmail.com">
                  <Button variant="outline" className="h-12 px-8 rounded-full shadow-sm bg-white hover:bg-gray-50">
                    <Mail className="mr-2 h-4 w-4" />
                    bayhoodpreperatoryschool@gmail.com
                  </Button>
                </a>
                <a href="tel:08098112378">
                  <Button variant="outline" className="h-12 px-8 rounded-full shadow-sm bg-white hover:bg-gray-50">
                    <Phone className="mr-2 h-4 w-4" />
                    0809 811 2378
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-[#1e293b] text-gray-400 text-sm">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white"><span className="text-blue-400">Bay</span><span className="text-red-400">hood</span></span>
            <span>© {new Date().getFullYear()} Bayhood Preparatory School. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
