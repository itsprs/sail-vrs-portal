import { TrendingUp } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import type { Compensation } from "@/types"
import { formatCurrency } from "@/utils/format"

interface CompensationCardProps {
  compensation: Compensation
}

export default function CompensationCard({
  compensation,
}: CompensationCardProps) {
  const navigate = useNavigate()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="size-4 text-muted-foreground" />
          VRS Compensation Estimate
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ItemGroup>
          <Item size="sm">
            <ItemContent>
              <ItemDescription>Formula A — Service-based</ItemDescription>
              <ItemTitle>{formatCurrency(compensation.formulaA)}</ItemTitle>
            </ItemContent>
          </Item>
          <Item size="sm">
            <ItemContent>
              <ItemDescription>Formula B — Remaining months</ItemDescription>
              <ItemTitle>{formatCurrency(compensation.formulaB)}</ItemTitle>
            </ItemContent>
          </Item>
          <Item size="sm">
            <ItemContent>
              <ItemDescription>Selected Basket</ItemDescription>
              <ItemTitle>{compensation.selectedBasket} (lower value)</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
      <CardFooter>
        <Item size="sm" className="rounded-none">
          <ItemContent>
            <ItemDescription>Final VR Compensation (75%)</ItemDescription>
            <ItemTitle className="text-lg font-semibold">
              {formatCurrency(compensation.finalCompensation)}
            </ItemTitle>
          </ItemContent>
          <ItemActions>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/compensation")}
            >
              Full breakdown
            </Button>
          </ItemActions>
        </Item>
      </CardFooter>
    </Card>
  )
}
