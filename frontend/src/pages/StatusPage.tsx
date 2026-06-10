import { ClipboardList, Inbox } from "lucide-react"
import { useNavigate } from "react-router-dom"
import PageError from "@/components/PageError"
import PageLoader from "@/components/PageLoader"
import PageShell from "@/components/shared/PageShell"
import SectionHeader from "@/components/shared/SectionHeader"
import ApplicationStatusCard from "@/components/status/ApplicationStatusCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useApplications } from "@/hooks/useApplications"
import { useAuth } from "@/hooks/useAuth"
import { ROUTES } from "@/utils/constants"

export default function StatusPage() {
  const navigate = useNavigate()
  const { employeeId } = useAuth()
  const { applications, loading, error } = useApplications()

  const application =
    applications.find((a) => a.employee_id === employeeId) ?? null

  if (loading) return <PageLoader message="Loading application status…" />
  if (error) return <PageError message={error} />

  return (
    <PageShell employeeId={employeeId}>
      <SectionHeader
        icon={ClipboardList}
        title="Application Status"
        description="Track the status of your VRS application."
      />
      {!application ? (
        <Card className="bg-muted/40">
          <CardContent className="flex flex-col items-center gap-4 py-16">
            <Inbox className="size-10 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                No application found
              </p>
              <p className="text-muted-foreground text-xs mt-1 max-w-xs">
                You have not submitted a VRS application yet.
              </p>
            </div>
            <div className="flex gap-3 mt-2">
              <Button onClick={() => navigate(ROUTES.apply)}>
                Apply for VRS
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.dashboard)}
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <ApplicationStatusCard application={application} />
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.dashboard)}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.compensation)}
            >
              View Compensation Breakdown
            </Button>
          </div>
        </>
      )}
    </PageShell>
  )
}
