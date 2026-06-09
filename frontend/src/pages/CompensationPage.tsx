import { TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AppHeader from "@/components/AppHeader"
import FormulaBreakdownCard from "@/components/compensation/FormulaBreakdownCard"
import PageError from "@/components/PageError"
import PageLoader from "@/components/PageLoader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getEmployee } from "@/services/api"
import type { EmployeeResponse } from "@/types"

export default function CompensationPage() {
  const navigate = useNavigate()
  const employeeId = localStorage.getItem("employee_id") ?? ""

  const [data, setData] = useState<EmployeeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getEmployee(employeeId)
      .then(setData)
      .catch(() => setError("Failed to load compensation details."))
      .finally(() => setLoading(false))
  }, [employeeId])

  if (loading) return <PageLoader message="Loading compensation details…" />
  if (error || !data) return <PageError message={error} />

  const { profile, vrsDetails } = data
  const { eligibility, compensation } = vrsDetails

  return (
    <div className="min-h-svh bg-background">
      <AppHeader employeeId={profile.employee_id} />
      <main className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <TrendingUp className="size-6 text-muted-foreground" />
            Compensation Breakdown
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Step-by-step calculation of your VRS compensation package.
          </p>
        </div>
        {!eligibility.isEligible || !compensation ? (
          <Card className="bg-muted/40">
            <CardContent className="py-6">
              <p className="text-sm text-muted-foreground">
                Compensation breakdown is only available for eligible employees.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/dashboard")}
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
              release. VR benefits are subject to income tax as per applicable
              rules. Final acceptance is at the sole discretion of SAIL
              management. This is an estimate — refer to the official scheme
              document for full terms.
            </p>
            <div className="flex gap-3">
              {eligibility.isEligible && (
                <Button onClick={() => navigate("/apply")}>
                  Apply for VRS
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
