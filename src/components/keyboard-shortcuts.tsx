"use client"

import { useEffect, useCallback } from "react"

interface Shortcut {
  key: string
  ctrl?: boolean
  meta?: boolean
  shift?: boolean
  handler: () => void
  label: string
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) return

      for (const s of shortcuts) {
        const ctrlOrMeta = s.ctrl || s.meta
        const matchCtrl = ctrlOrMeta ? (e.metaKey || e.ctrlKey) : (!e.metaKey && !e.ctrlKey)
        if (e.key.toLowerCase() === s.key.toLowerCase() && matchCtrl && !!s.shift === e.shiftKey) {
          e.preventDefault()
          s.handler()
          return
        }
      }
    },
    [shortcuts]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])
}

export function ShortcutHint({ shortcuts }: { shortcuts: Shortcut[] }) {
  const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().includes("MAC")

  return (
    <div className="fixed bottom-4 right-4 z-30">
      <div className="rounded-lg border bg-card p-2 shadow-sm">
        <p className="px-2 pb-1 text-[10px] font-medium text-muted-foreground">Keyboard shortcuts</p>
        <div className="space-y-0.5">
          {shortcuts.map((s) => (
            <div key={s.key} className="flex items-center justify-between gap-4 px-2 py-0.5">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                {s.ctrl && (isMac ? "⌘" : "Ctrl+")}{s.shift && "⇧"}{s.key.toUpperCase()}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
