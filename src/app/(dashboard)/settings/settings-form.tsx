"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SettingsForm({ userName, userEmail }: { userName: string; userEmail: string }) {
  const [name, setName] = useState(userName)
  const [saved, setSaved] = useState(false)

  return (
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
        <Button
          onClick={() => {
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
          }}
        >
          {saved ? "Saved!" : "Save changes"}
        </Button>
      </CardContent>
    </Card>
  )
}
