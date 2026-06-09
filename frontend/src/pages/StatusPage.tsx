import { ClipboardList, Inbox } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AppHeader from "@/components/AppHeader"
import PageError from "@/components/PageError"
import PageLoader from "@/components/PageLoader"
import ApplicationStatusCard from "@/components/status/ApplicationStatusCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getAllApplications } from "@/services/api"
import type { VRSApplication } from "@/types"

export default function StatusPage() {
  const navigate = useNavigate()
  const employeeId = localStorage.getItem("employee_id") ?? ""

  const [application, setApplication] = useState<VRSApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getAllApplications()
      .then((all) => {
        const mine = all.find((a) => a.employee_id === employeeId) ?? null
        setApplication(mine)
      })
      .catch(() => setError("Failed to load application status."))
      .finally(() => setLoading(false))
  }, [employeeId])

  if (loading) return <PageLoader message="Loading application status…" />
  if (error) return <PageError message={error} />

  return (
    <div className="min-h-svh bg-background">
      <AppHeader employeeId={employeeId} />
      <main className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <ClipboardList className="size-6 text-muted-foreground" />
            Application Status
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track the status of your VRS application.
          </p>
        </div>
        {!application ? (
          <Card className="bg-muted/40">
            <CardContent className="flex flex-col items-center gap-4 py-16">
              <Inbox className="size-10 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  No application found
                </p>
                <p className="text-muted-foreground text-xs mt-1 max-w-xs">
                  You have not submitted a VRS application yet. If you are
                  eligible, you can apply from the dashboard.
                </p>
              </div>
              <div className="flex gap-3 mt-2">
                <Button onClick={() => navigate("/apply")}>
                  Apply for VRS
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
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
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/compensation")}
              >
                View Compensation Breakdown
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
