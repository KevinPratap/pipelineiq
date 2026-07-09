import Link from "next/link"
import { ArrowRight, KanbanSquare, BarChart3, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <KanbanSquare className="h-6 w-6" />
            <span className="text-lg font-semibold">PipelineIQ</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Close deals faster.
            <br />
            <span className="text-muted-foreground">PipelineIQ</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Visual pipeline management for B2B sales teams. Drag deals through stages, track revenue, and forecast with confidence.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Start free trial <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </section>

        <section className="border-t py-24">
          <div className="container mx-auto px-6">
            <div className="grid gap-12 md:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="flex flex-col items-center text-center">
                  <div className="mb-4 rounded-lg border p-3">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>PipelineIQ — Built for Digital Heroes</p>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: KanbanSquare,
    title: "Visual Pipeline",
    description: "Drag and drop deals through customizable stages from lead to closed won.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Real-time metrics on conversion rates, deal velocity, and weighted revenue.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share notes, log activities, and close deals together.",
  },
]
