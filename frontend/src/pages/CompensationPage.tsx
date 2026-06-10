import { TrendingUp } from "lucide-react"
import { useNavigate } from "react-router-dom"
import FormulaBreakdownCard from "@/components/compensation/FormulaBreakdownCard"
import PageError from "@/components/PageError"
import PageLoader from "@/components/PageLoader"
import PageShell from "@/components/shared/PageShell"
import SectionHeader from "@/components/shared/SectionHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { useEmployee } from "@/hooks/useEmployee"
import { ROUTES } from "@/utils/constants"

export default function CompensationPage() {
  const navigate = useNavigate()
  const { employeeId } = useAuth()
  const { data, loading, error } = useEmployee(employeeId)

  if (loading) return <PageLoader message="Loading compensation details…" />
  if (error || !data) return <PageError message={error} />

  const { profile, vrsDetails } = data
  const { eligibility, compensation } = vrsDetails

  return (
    <PageShell employeeId={profile.employee_id}>
      <SectionHeader
        icon={TrendingUp}
        title="Compensation Breakdown"
        description="Step-by-step calculation of your VRS compensation package."
      />
      {!eligibility.isEligible || !compensation ? (
        <Card className="bg-muted/40">
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground">
              Compensation breakdown is only available for eligible employees.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate(ROUTES.dashboard)}
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <FormulaBreakdownCard
            compensation={compensation}
            eligibility={eligibility}
          />
          <p className="text-xs text-muted-foreground leading-relaxed">
            * Salary is calculated on Basic Pay + DA only, as on date of
            release. VR benefits are subject to income tax. Final acceptance is
            at SAIL's sole discretion. This is an estimate — refer to the
            official scheme document for full terms.
          </p>
          <div className="flex gap-3">
            {eligibility.isEligible && (
              <Button onClick={() => navigate(ROUTES.apply)}>
                Apply for VRS
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.dashboard)}
            >
              Back to Dashboard
            </Button>
          </div>
        </>
      )}
    </PageShell>
  )
}
