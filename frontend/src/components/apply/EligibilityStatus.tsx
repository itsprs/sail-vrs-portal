import { ShieldCheck, ShieldX } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import type { Eligibility } from "@/types"

interface EligibilityStatusProps {
  eligibility: Eligibility
}

export default function EligibilityStatus({
  eligibility,
}: EligibilityStatusProps) {
  const { isEligible, age, serviceYears, message } = eligibility

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            {isEligible ? (
              <ShieldCheck className="size-4 text-muted-foreground" />
            ) : (
              <ShieldX className="size-4 text-muted-foreground" />
            )}
            Eligibility Check
          </span>
          <Badge variant={isEligible ? "default" : "secondary"}>
            {isEligible ? "Eligible" : "Not Eligible"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ItemGroup>
          <Item size="sm">
            <ItemContent>
              <ItemDescription>Age</ItemDescription>
              <ItemTitle className={age < 50 ? "text-destructive" : ""}>
                {age} years {age < 50 ? "(minimum 50 required)" : "✓"}
              </ItemTitle>
            </ItemContent>
          </Item>
          <Item size="sm">
            <ItemContent>
              <ItemDescription>Years of Service</ItemDescription>
              <ItemTitle
                className={serviceYears < 15 ? "text-destructive" : ""}
              >
                {serviceYears} years{" "}
                {serviceYears < 15 ? "(minimum 15 required)" : "✓"}
              </ItemTitle>
            </ItemContent>
          </Item>
          <Item size="sm" variant="muted">
            <ItemContent>
              <ItemDescription>Status</ItemDescription>
              <ItemTitle className="text-sm font-normal text-muted-foreground">
                {message}
              </ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
