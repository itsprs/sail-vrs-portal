import { ClipboardCheck } from "lucide-react"
import CompensationRows from "@/components/shared/CompensationRows"
import StatusBadge from "@/components/shared/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import type { VRSApplication } from "@/types"
import { formatDateTime } from "@/utils/format"

interface ApplicationDetailCardProps {
  application: VRSApplication
}

export default function ApplicationDetailCard({
  application,
}: ApplicationDetailCardProps) {
  const {
    application_id,
    employee_id,
    designation_type,
    submission_timestamp,
    status,
    formula_a_value,
    formula_b_value,
    final_compensation,
  } = application

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ClipboardCheck className="size-4 text-muted-foreground" />
            Application #{application_id}
          </span>
          <StatusBadge status={status} className="text-sm px-3 py-1" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ItemGroup>
          <Item size="sm">
            <ItemContent>
              <ItemDescription>Employee ID</ItemDescription>
              <ItemTitle>{employee_id}</ItemTitle>
            </ItemContent>
          </Item>
          <Item size="sm">
            <ItemContent>
              <ItemDescription>Designation Type</ItemDescription>
              <ItemTitle>{designation_type}</ItemTitle>
            </ItemContent>
          </Item>
          <Item size="sm">
            <ItemContent>
              <ItemDescription>Submitted On</ItemDescription>
              <ItemTitle>{formatDateTime(submission_timestamp)}</ItemTitle>
            </ItemContent>
          </Item>
          <CompensationRows
            formulaA={formula_a_value}
            formulaB={formula_b_value}
            finalCompensation={final_compensation}
          />
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
