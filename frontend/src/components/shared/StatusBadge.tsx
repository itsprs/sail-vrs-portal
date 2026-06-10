import { Badge } from "@/components/ui/badge"
import type { ApplicationStatus } from "@/types"
import { STATUS_VARIANT } from "@/utils/constants"

interface StatusBadgeProps {
  status: ApplicationStatus
  className?: string
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className={className}>
      {status}
    </Badge>
  )
}
