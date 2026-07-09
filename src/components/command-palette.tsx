"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, KanbanSquare, BarChart3, LayoutDashboard, Settings } from "lucide-react"

interface Command {
  id: string
  label: string
  icon: React.ReactNode
  action: () => void
  shortcut?: string
}

export function CommandPalette({ onNewDeal }: { onNewDeal?: () => void }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const commands = useMemo<Command[]>(() => [
    { id: "dashboard", label: "Go to Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, action: () => router.push("/dashboard"), shortcut: "G D" },
    { id: "pipeline", label: "Go to Pipeline", icon: <KanbanSquare className="h-4 w-4" />, action: () => router.push("/pipeline"), shortcut: "G P" },
    { id: "analytics", label: "Go to Analytics", icon: <BarChart3 className="h-4 w-4" />, action: () => router.push("/analytics"), shortcut: "G A" },
    { id: "settings", label: "Go to Settings", icon: <Settings className="h-4 w-4" />, action: () => router.push("/settings"), shortcut: "G S" },
    { id: "new-deal", label: "Create New Deal", icon: <Plus className="h-4 w-4" />, action: () => { setOpen(false); onNewDeal?.() }, shortcut: "N" },
  ], [router, onNewDeal])

  // Cmd+K / Ctrl+K toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((p) => !p)
      }
      if (e.key === "Escape" && open) {
        setOpen(false)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
    setQuery("")
  }, [open])

  const filtered = query
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()) || c.id.includes(query.toLowerCase()))
    : commands

  const handleSelect = useCallback((cmd: Command) => {
    cmd.action()
    setOpen(false)
  }, [])

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)} />
      <div className="fixed left-1/2 top-[15%] z-50 w-full max-w-lg -translate-x-1/2 rounded-lg border bg-card shadow-2xl">
        <div className="flex items-center border-b px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">ESC</kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No results for "{query}"</p>
          ) : (
            <div className="space-y-0.5">
              {filtered.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => handleSelect(cmd)}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-secondary"
                >
                  <span className="text-muted-foreground">{cmd.icon}</span>
                  <span className="flex-1 text-left">{cmd.label}</span>
                  {cmd.shortcut && (
                    <kbd className="rounded border bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {cmd.shortcut}
                    </kbd>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
