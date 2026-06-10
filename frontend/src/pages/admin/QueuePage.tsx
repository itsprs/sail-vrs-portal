import { Inbox, Users } from "lucide-react"
import ApplicationsTable from "@/components/admin/ApplicationsTable"
import PageError from "@/components/PageError"
import PageLoader from "@/components/PageLoader"
import PageShell from "@/components/shared/PageShell"
import SectionHeader from "@/components/shared/SectionHeader"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useApplications } from "@/hooks/useApplications"
import { useAuth } from "@/hooks/useAuth"

export default function QueuePage() {
  const { employeeId } = useAuth()
  const { applications, loading, error, refetch } = useApplications()

  const pending = applications.filter((a) => a.status === "Pending").length
  const approved = applications.filter((a) => a.status === "Approved").length
  const rejected = applications.filter((a) => a.status === "Rejected").length

  if (loading) return <PageLoader message="Loading applications…" />
  if (error) return <PageError message={error} />

  return (
    <PageShell employeeId={employeeId} wide>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeader
          icon={Users}
          title="Application Queue"
          description="Applications processed on first-come, first-served basis."
        />
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">{pending} Pending</Badge>
          <Badge variant="default">{approved} Approved</Badge>
          <Badge variant="destructive">{rejected} Rejected</Badge>
        </div>
      </div>
      {applications.length === 0 ? (
        <Card className="bg-muted/40">
          <CardContent className="flex flex-col items-center gap-4 py-16">
            <Inbox className="size-10 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                No applications yet
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                VRS applications will appear here once submitted.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <ApplicationsTable
              applications={applications}
              onStatusChange={refetch}
            />
          </CardContent>
        </Card>
      )}
    </PageShell>
  )
}
