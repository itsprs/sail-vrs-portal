import { Info } from "lucide-react"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Compensation, Eligibility } from "@/types"
import { formatCurrency } from "@/utils/format"

interface FormulaBreakdownCardProps {
  compensation: Compensation
  eligibility: Eligibility
}

export default function FormulaBreakdownCard({
  compensation,
  eligibility,
}: FormulaBreakdownCardProps) {
  const { dailySalary, formulaA, formulaB, selectedBasket, finalCompensation } =
    compensation
  const { serviceYears, remainingMonths } = eligibility
  const remainingYears = (remainingMonths / 12).toFixed(1)

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Daily Salary Basis
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="size-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    All formulas use daily salary as the base unit
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ItemGroup>
            <Item size="sm">
              <ItemContent>
                <ItemDescription className="flex items-center gap-1">
                  Daily Salary
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="size-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          (Basic Pay + DA) ÷ 26 working days
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </ItemDescription>
                <ItemTitle>{formatCurrency(dailySalary)}</ItemTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Formula A — Service Based</span>
            {selectedBasket === "Formula A" && <Badge>Selected</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ItemGroup>
            <Item size="sm">
              <ItemContent>
                <ItemDescription>
                  35 days × Daily Salary × Completed Years
                </ItemDescription>
                <ItemTitle>
                  35 × {formatCurrency(dailySalary)} × {serviceYears} yrs
                </ItemTitle>
              </ItemContent>
            </Item>
            <Item size="sm">
              <ItemContent>
                <ItemDescription>
                  25 days × Daily Salary × Remaining Years
                </ItemDescription>
                <ItemTitle>
                  25 × {formatCurrency(dailySalary)} × {remainingYears} yrs
                </ItemTitle>
              </ItemContent>
            </Item>
            <Separator />
            <Item size="sm" variant="muted">
              <ItemContent>
                <ItemDescription>Formula A Total</ItemDescription>
                <ItemTitle className="text-base font-semibold">
                  {formatCurrency(formulaA)}
                </ItemTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Formula B — Remaining Months</span>
            {selectedBasket === "Formula B" && <Badge>Selected</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ItemGroup>
            <Item size="sm">
              <ItemContent>
                <ItemDescription>
                  30 days × Daily Salary × Months before superannuation
                </ItemDescription>
                <ItemTitle>
                  30 × {formatCurrency(dailySalary)} × {remainingMonths} months
                </ItemTitle>
              </ItemContent>
            </Item>
            <Separator />
            <Item size="sm" variant="muted">
              <ItemContent>
                <ItemDescription>Formula B Total</ItemDescription>
                <ItemTitle className="text-base font-semibold">
                  {formatCurrency(formulaB)}
                </ItemTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Final VR Compensation</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ItemGroup>
            <Item size="sm">
              <ItemContent>
                <ItemDescription>
                  Lesser of Formula A and Formula B
                </ItemDescription>
                <ItemTitle>
                  {formatCurrency(Math.min(Number(formulaA), Number(formulaB)))}
                </ItemTitle>
              </ItemContent>
            </Item>
            <Item size="sm">
              <ItemContent>
                <ItemDescription>Multiplied by 75%</ItemDescription>
                <ItemTitle>× 0.75</ItemTitle>
              </ItemContent>
            </Item>
            <Separator />
            <Item size="sm" variant="muted">
              <ItemContent>
                <ItemDescription>Final VR Compensation</ItemDescription>
                <ItemTitle className="text-xl font-semibold">
                  {formatCurrency(finalCompensation)}
                </ItemTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>
    </div>
  )
}
