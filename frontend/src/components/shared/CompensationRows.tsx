import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/utils/format"

interface CompensationRowsProps {
  formulaA: number
  formulaB: number
  finalCompensation: number
}

export default function CompensationRows({
  formulaA,
  formulaB,
  finalCompensation,
}: CompensationRowsProps) {
  return (
    <>
      <Item size="sm">
        <ItemContent>
          <ItemDescription>Formula A</ItemDescription>
          <ItemTitle>{formatCurrency(formulaA)}</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="sm">
        <ItemContent>
          <ItemDescription>Formula B</ItemDescription>
          <ItemTitle>{formatCurrency(formulaB)}</ItemTitle>
        </ItemContent>
      </Item>
      <Separator />
      <Item size="sm" variant="muted">
        <ItemContent>
          <ItemDescription>Final VR Compensation (75%)</ItemDescription>
          <ItemTitle className="text-lg font-semibold">
            {formatCurrency(finalCompensation)}
          </ItemTitle>
        </ItemContent>
      </Item>
    </>
  )
}
