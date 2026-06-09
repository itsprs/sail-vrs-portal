import { CheckCircle2, ClipboardList } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import AppHeader from "@/components/AppHeader"
import ACPInfoCard from "@/components/apply/ACPInfoCard"
import EligibilityStatus from "@/components/apply/EligibilityStatus"
import PageError from "@/components/PageError"
import PageLoader from "@/components/PageLoader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getEmployee, submitApplication } from "@/services/api"
import type { EmployeeResponse } from "@/types"

export default function ApplyPage() {
  const navigate = useNavigate()
  const employeeId = localStorage.getItem("employee_id") ?? ""

  const [data, setData] = useState<EmployeeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    getEmployee(employeeId)
      .then(setData)
      .catch(() => setError("Failed to load your profile. Please try again."))
      .finally(() => setLoading(false))
  }, [employeeId])

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await submitApplication(employeeId)
      setSubmitted(true)
      toast.success("Application submitted successfully.")
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to submit application."
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <PageLoader message="Loading your profile…" />
  if (error || !data) return <PageError message={error} />

  const { profile, gradingHistory, vrsDetails } = data
  const { eligibility, averageCreditPoint } = vrsDetails
  const isExecutive = profile.designation_type === "Executive"

  if (submitted) {
    return (
      <div className="min-h-svh bg-background flex flex-col">
        <AppHeader employeeId={profile.employee_id} />
        <main className="max-w-4xl w-full m-auto px-6 py-10">
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-16">
              <CheckCircle2 className="size-12 text-green-500" />
              <h2 className="text-xl font-semibold text-foreground">
                Application Submitted
              </h2>
              <p className="text-muted-foreground text-sm text-center max-w-sm">
                Your VRS application has been submitted successfully and is
                pending review by HR. Applications are processed on a
                first-come, first-served basis.
              </p>
              <Button onClick={() => navigate("/status")} className="mt-2">
                Check Application Status
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background">
      <AppHeader employeeId={profile.employee_id} />
      <main className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <ClipboardList className="size-6 text-muted-foreground" />
            Apply for VRS
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Review your eligibility before submitting your application.
          </p>
        </div>
        <EligibilityStatus eligibility={eligibility} />
        {isExecutive && (
          <ACPInfoCard
            gradingHistory={gradingHistory}
            averageCreditPoint={averageCreditPoint}
            eligibility={eligibility}
          />
        )}
        {eligibility.isEligible && (
          <Card>
            <CardContent className="flex flex-col gap-4 py-6">
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  Ready to apply?
                </h3>
                <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                  By submitting, you acknowledge that this application is
                  voluntary and final acceptance is at the sole discretion of
                  SAIL management. VRS benefits are subject to income tax.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="gap-2"
                >
                  {submitting ? "Submitting…" : "Submit VRS Application"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {!eligibility.isEligible && (
          <Card className="bg-muted/40">
            <CardContent className="py-6">
              <p className="text-sm text-muted-foreground">
                You do not meet the eligibility criteria for VRS at this time.
                Please contact HR for further information.
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
        )}
      </main>
    </div>
  )
}
