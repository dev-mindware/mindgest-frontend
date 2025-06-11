"use client"
import { useEffect } from "react"

export function PrimaryColorPicker() {
  const setPrimaryColor = (hex: string) => {
    const root = document.documentElement
    root.style.setProperty("--primary", hex)
    localStorage.setItem("primary-color", hex)
  }

  useEffect(() => {
    const saved = localStorage.getItem("primary-color")
    if (saved) {
      document.documentElement.style.setProperty("--primary", saved)
    }
  }, [])

  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        onChange={(e) => setPrimaryColor(e.target.value)}
        defaultValue="#9956F6"
        className="w-8 h-8 border rounded"
        title="Escolher cor primária"
      />
      <span className="text-sm text-muted-foreground">Escolhe a cor primária</span>
    </div>
  )
}
