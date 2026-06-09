import { ClipboardCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import type { ApplicationStatus, VRSApplication } from "@/types"
import { formatCurrency, formatDateTime } from "@/utils/format"

interface ApplicationStatusCardProps {
  application: VRSApplication
}

const statusVariant: Record<
  ApplicationStatus,
  "default" | "secondary" | "destructive"
> = {
  Pending: "secondary",
  Approved: "default",
  Rejected: "destructive",
}

const statusMessage: Record<ApplicationStatus, string> = {
  Pending:
    "Your application is in the queue and awaiting HR review. Applications are processed on a first-come, first-served basis.",
  Approved:
    "Congratulations — your VRS application has been approved by SAIL management.",
  Rejected:
    "Your VRS application was not approved at this time. Please contact HR for further information.",
}

export default function ApplicationStatusCard({
  application,
}: ApplicationStatusCardProps) {
  const {
    status,
    submission_timestamp,
    final_compensation,
    formula_a_value,
    formula_b_value,
  } = application

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ClipboardCheck className="size-4 text-muted-foreground" />
            Application #{application.application_id}
          </span>
          <Badge variant={statusVariant[status]} className="text-sm px-3 py-1">
            {status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ItemGroup>
          <Item size="sm">
            <ItemContent>
              <ItemDescription>Submitted on</ItemDescription>
              <ItemTitle>{formatDateTime(submission_timestamp)}</ItemTitle>
            </ItemContent>
          </Item>
          <Item size="sm">
            <ItemContent>
              <ItemDescription>Employee ID</ItemDescription>
              <ItemTitle>{application.employee_id}</ItemTitle>
            </ItemContent>
          </Item>
          <Separator />
          <Item size="sm">
            <ItemContent>
              <ItemDescription>Formula A</ItemDescription>
              <ItemTitle>{formatCurrency(formula_a_value)}</ItemTitle>
            </ItemContent>
          </Item>
          <Item size="sm">
            <ItemContent>
              <ItemDescription>Formula B</ItemDescription>
              <ItemTitle>{formatCurrency(formula_b_value)}</ItemTitle>
            </ItemContent>
          </Item>
          <Item size="sm" variant="muted">
            <ItemContent>
              <ItemDescription>Final VR Compensation (75%)</ItemDescription>
              <ItemTitle className="text-lg font-semibold">
                {formatCurrency(final_compensation)}
              </ItemTitle>
            </ItemContent>
          </Item>
          <Separator />
          <Item size="sm" variant="muted">
            <ItemContent>
              <ItemDescription>Status Note</ItemDescription>
              <ItemTitle className="text-sm font-normal text-muted-foreground">
                {statusMessage[status]}
              </ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
