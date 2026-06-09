import { GraduationCap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Eligibility, GradingHistory } from "@/types"

interface ACPInfoCardProps {
  gradingHistory: GradingHistory[]
  averageCreditPoint: string
  eligibility: Eligibility
}

const getACPLimit = (age: number) => {
  if (age >= 57) return null
  if (age >= 54) return 45.0
  return 42.5
}

export default function ACPInfoCard({
  gradingHistory,
  averageCreditPoint,
  eligibility,
}: ACPInfoCardProps) {
  const acpLimit = getACPLimit(eligibility.age)
  const acp = Number(averageCreditPoint)
  const acpPassed = acpLimit === null || acp <= acpLimit

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <GraduationCap className="size-4 text-muted-foreground" />
            ACP Criteria (Executive)
          </span>
          <Badge variant={acpPassed ? "default" : "destructive"}>
            {acpPassed ? "Passed" : "Failed"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ItemGroup>
          <Item size="sm">
            <ItemContent>
              <ItemDescription>Average Credit Point (ACP)</ItemDescription>
              <ItemTitle className={!acpPassed ? "text-destructive" : ""}>
                {averageCreditPoint}
                {acpLimit !== null && (
                  <span className="text-muted-foreground text-xs font-normal ml-2">
                    (limit: ≤ {acpLimit} for age {eligibility.age})
                  </span>
                )}
                {acpLimit === null && (
                  <span className="text-muted-foreground text-xs font-normal ml-2">
                    (any ACP accepted for age 57+)
                  </span>
                )}
              </ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
        {gradingHistory.length > 0 && (
          <div className="px-4 pb-4">
            <p className="text-xs text-muted-foreground mb-3">
              Appraisal history (last 4 years, most recent year excluded from
              ACP)
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradingHistory.map((row) => (
                  <TableRow key={row.appraisal_year}>
                    <TableCell>{row.appraisal_year}</TableCell>
                    <TableCell>{row.grade}</TableCell>
                    <TableCell className="text-right">{row.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
