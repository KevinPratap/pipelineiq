"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"

const steps = [
  {
    title: "Welcome to PipelineIQ",
    description: "Your visual sales pipeline. Track deals, forecast revenue, and close faster.",
    illustration: (
      <div className="flex items-center justify-center py-8">
        <div className="grid grid-cols-3 gap-2">
          {["Lead", "Qualified", "Proposal"].map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div className={`h-8 w-8 rounded-lg border ${i === 0 ? "bg-foreground/20" : "bg-muted"}`} />
              <span className="text-[10px] text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Create your first deal",
    description: "Add a deal, assign a value, and drag it through stages as it progresses.",
    illustration: (
      <div className="flex items-center justify-center py-8">
        <div className="rounded-lg border bg-card p-3 shadow-sm">
          <div className="mb-2 h-2 w-24 rounded bg-foreground/20" />
          <div className="mb-3 h-2 w-16 rounded bg-muted" />
          <div className="flex gap-2">
            <div className="h-2 flex-1 rounded bg-green-500/50" />
            <span className="text-[10px] font-semibold">$50k</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Track & win",
    description: "Use the dashboard to monitor pipeline health, forecast revenue, and spot at-risk deals.",
    illustration: (
      <div className="flex items-center justify-center py-8">
        <div className="w-full max-w-xs space-y-3">
          <div className="flex gap-2">
            {[80, 60, 40].map((w) => (
              <div key={w} className="flex-1 rounded-lg border p-2">
                <div className="h-2 w-full rounded bg-foreground/20" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div className="h-full w-3/5 rounded-full bg-foreground/20" />
          </div>
        </div>
      </div>
    ),
  },
]

export function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)
  const router = useRouter()

  const current = steps[step]
  const isLast = step === steps.length - 1

  const handleNext = () => {
    if (isLast) {
      onComplete()
      router.push("/pipeline")
    } else {
      setStep(step + 1)
    }
  }

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex items-center gap-1">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-6 rounded-full transition-colors ${i <= step ? "bg-foreground" : "bg-muted"}`}
          />
        ))}
      </div>

      {current.illustration}

      <h2 className="mt-4 text-xl font-semibold">{current.title}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{current.description}</p>

      <div className="mt-8 flex items-center gap-3">
        {!isLast && (
          <Button variant="ghost" size="sm" onClick={onComplete}>
            Skip
          </Button>
        )}
        <Button onClick={handleNext}>
          {isLast ? (
            <>
              Start using PipelineIQ <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
