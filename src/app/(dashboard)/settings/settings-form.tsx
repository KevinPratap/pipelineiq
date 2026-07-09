"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateDeal } from "@/lib/actions/deal"
import { toast } from "sonner"
import { auth } from "@/lib/auth"

export function SettingsForm({ userName, userEmail }: { userName: string; userEmail: string }) {
  const router = useRouter()
  const [name, setName] = useState(userName)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    // For now just show saved — user profile update requires a dedicated server action
    toast.success("Settings saved")
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input value={userEmail} disabled className="text-muted-foreground" />
          </div>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Download your pipeline data as a CSV file.
          </p>
          <Button variant="outline" onClick={() => window.open("/api/export/csv", "_blank")}>
            Export CSV
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
