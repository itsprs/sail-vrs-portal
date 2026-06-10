import type { LucideIcon } from "lucide-react"

interface SectionHeaderProps {
  icon?: LucideIcon
  title: string
  description?: string
}

export default function SectionHeader({
  icon: Icon,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
        {Icon && <Icon className="size-6 text-muted-foreground" />}
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      )}
    </div>
  )
}
