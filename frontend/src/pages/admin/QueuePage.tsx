import { Inbox, Users } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import AppHeader from "@/components/AppHeader"
import ApplicationsTable from "@/components/admin/ApplicationsTable"
import PageError from "@/components/PageError"
import PageLoader from "@/components/PageLoader"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getAllApplications } from "@/services/api"
import type { VRSApplication } from "@/types"

export default function QueuePage() {
  const employeeId = localStorage.getItem("employee_id") ?? ""

  const [applications, setApplications] = useState<VRSApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchApplications = useCallback(() => {
    setLoading(true)
    getAllApplications()
      .then(setApplications)
      .catch(() => setError("Failed to load applications."))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const pending = applications.filter((a) => a.status === "Pending").length
  const approved = applications.filter((a) => a.status === "Approved").length
  const rejected = applications.filter((a) => a.status === "Rejected").length

  if (loading) return <PageLoader message="Loading applications…" />
  if (error) return <PageError message={error} />

  return (
    <div className="min-h-svh bg-background">
      <AppHeader employeeId={employeeId} />
      <main className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Users className="size-6 text-muted-foreground" />
              Application Queue
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Applications processed on first-come, first-served basis.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">{pending} Pending</Badge>
            <Badge variant="default">{approved} Approved</Badge>
            <Badge variant="destructive">{rejected} Rejected</Badge>
          </div>
        </div>
        <Separator />
        {applications.length === 0 ? (
          <Card className="bg-muted/40">
            <CardContent className="flex flex-col items-center gap-4 py-16">
              <Inbox className="size-10 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  No applications yet
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  VRS applications submitted by employees will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <ApplicationsTable
                applications={applications}
                onStatusChange={fetchApplications}
              />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
