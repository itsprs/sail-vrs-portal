import { CheckCircle2, ClipboardList } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import ACPInfoCard from "@/components/apply/ACPInfoCard"
import EligibilityStatus from "@/components/apply/EligibilityStatus"
import PageError from "@/components/PageError"
import PageLoader from "@/components/PageLoader"
import PageShell from "@/components/shared/PageShell"
import SectionHeader from "@/components/shared/SectionHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { useEmployee } from "@/hooks/useEmployee"
import { submitApplication } from "@/services/api"
import { ROUTES } from "@/utils/constants"
import { extractErrorMessage } from "@/utils/errors"

export default function ApplyPage() {
  const navigate = useNavigate()
  const { employeeId } = useAuth()
  const { data, loading, error } = useEmployee(employeeId)

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await submitApplication(employeeId)
      setSubmitted(true)
      toast.success("Application submitted successfully.")
    } catch (err) {
      toast.error(extractErrorMessage(err, "Failed to submit application."))
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
      <PageShell employeeId={profile.employee_id}>
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16">
            <CheckCircle2 className="size-12 text-green-500" />
            <h2 className="text-xl font-semibold text-foreground">
              Application Submitted
            </h2>
            <p className="text-muted-foreground text-sm text-center max-w-sm">
              Your VRS application has been submitted and is pending HR review.
              Applications are processed first-come, first-served.
            </p>
            <Button onClick={() => navigate(ROUTES.status)} className="mt-2">
              Check Application Status
            </Button>
          </CardContent>
        </Card>
      </PageShell>
    )
  }

  return (
    <PageShell employeeId={profile.employee_id}>
      <SectionHeader
        icon={ClipboardList}
        title="Apply for VRS"
        description="Review your eligibility before submitting your application."
      />
      <EligibilityStatus eligibility={eligibility} />
      {isExecutive && (
        <ACPInfoCard
          gradingHistory={gradingHistory}
          averageCreditPoint={averageCreditPoint}
          eligibility={eligibility}
        />
      )}
      {eligibility.isEligible ? (
        <Card>
          <CardContent className="flex flex-col gap-4 py-6">
            <div>
              <h3 className="text-sm font-medium text-foreground">
                Ready to apply?
              </h3>
              <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                By submitting, you acknowledge this application is voluntary and
                final acceptance is at SAIL's sole discretion. VRS benefits are
                subject to income tax.
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
                onClick={() => navigate(ROUTES.dashboard)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-muted/40">
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground">
              You do not meet the eligibility criteria for VRS. Please contact
              HR for further information.
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
      )}
    </PageShell>
  )
}
