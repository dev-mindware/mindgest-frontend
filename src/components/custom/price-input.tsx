import { useId } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PriceInput() {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Input with inline start and end add-on</Label>
      <div className="relative flex rounded-md shadow-xs">
        <span className="absolute inset-y-0 flex items-center justify-center text-sm pointer-events-none text-muted-foreground start-0 ps-3">
          €
        </span>
        <Input
          id={id}
          className="shadow-none -me-px rounded-e-none ps-6"
          placeholder="0.00"
          type="text"
        />
        <span className="inline-flex items-center px-3 text-sm border border-input bg-background text-muted-foreground -z-10 rounded-e-md">
          EUR
        </span>
      </div>
    </div>
  )
}
