import { cn } from "@/lib/utils"

interface Option {
  value: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

interface QuizSelectProps {
  options: Option[]
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export function QuizSelect({
  options,
  value,
  onChange,
  className,
}: QuizSelectProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange?.(opt.value)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-md border transition-all text-left",
            value === opt.value
              ? "border-primary bg-background"
              : "border-transparent bg-sidebar",
            "hover:border-muted-foreground/20"
          )}
        >
          {opt.icon && <opt.icon className="w-5 h-5 text-foreground" />}
          <span className="text-sm text-muted-foreground">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}
