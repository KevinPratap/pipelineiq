"use client"

import { useState, useEffect } from "react"
import { OnboardingWizard } from "@/components/onboarding-wizard"

export function DashboardOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  if (showOnboarding) {
    return (
      <div className="mx-auto max-w-2xl pt-12">
        <OnboardingWizard onComplete={() => setShowOnboarding(false)} />
      </div>
    )
  }

  return null
}
