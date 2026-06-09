import { IndianRupee, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Compensation, Employee } from "@/types"
import { formatCurrency } from "@/utils/format"

interface SalaryCardProps {
  profile: Employee
  compensation: Compensation | null
}

export default function SalaryCard({ profile, compensation }: SalaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <IndianRupee className="size-4 text-muted-foreground" />
          Salary Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ItemGroup>
          <Item size="sm">
            <ItemContent>
              <ItemDescription>Basic Pay</ItemDescription>
              <ItemTitle>{formatCurrency(profile.basic_pay)}</ItemTitle>
            </ItemContent>
          </Item>
          <Item size="sm">
            <ItemContent>
              <ItemDescription>Dearness Allowance (DA)</ItemDescription>
              <ItemTitle>{formatCurrency(profile.da)}</ItemTitle>
            </ItemContent>
          </Item>
          {compensation && (
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
                <ItemTitle>
                  {formatCurrency(compensation.dailySalary)}
                </ItemTitle>
              </ItemContent>
            </Item>
          )}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
