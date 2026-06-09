import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import AppHeader from "@/components/AppHeader"
import ApplicationDetailCard from "@/components/admin/ApplicationDetailCard"
import PageError from "@/components/PageError"
import PageLoader from "@/components/PageLoader"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getApplication, updateApplicationStatus } from "@/services/api"
import type { VRSApplication } from "@/types"
import { formatCurrency } from "@/utils/format"

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const employeeId = localStorage.getItem("employee_id") ?? ""

  const [application, setApplication] = useState<VRSApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) return
    getApplication(Number(id))
      .then(setApplication)
      .catch(() => setError("Failed to load application details."))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatus = async (status: "Approved" | "Rejected") => {
    if (!application) return
    try {
      await updateApplicationStatus(application.application_id, { status })
      toast.success(`Application ${status.toLowerCase()} successfully.`)
      setApplication((prev) => (prev ? { ...prev, status } : prev))
    } catch {
      toast.error("Failed to update status. Please try again.")
    }
  }

  if (loading) return <PageLoader message="Loading application details…" />
  if (error || !application) return <PageError message={error} />

  const isPending = application.status === "Pending"

  return (
    <div className="min-h-svh bg-background">
      <AppHeader employeeId={employeeId} />
      <main className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-8">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/queue")}
            className="gap-2 mb-4 -ml-2 text-muted-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Queue
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Application Detail
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Review and take action on this VRS application.
          </p>
        </div>
        <Separator />
        <ApplicationDetailCard application={application} />
        {isPending && (
          <div className="flex gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Approve Application</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Approve Application?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will approve the VRS application for{" "}
                    <strong>{application.employee_id}</strong> with a final
                    compensation of{" "}
                    <strong>
                      {formatCurrency(application.final_compensation)}
                    </strong>
                    . This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleStatus("Approved")}>
                    Confirm Approve
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Reject Application</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reject Application?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reject the VRS application for{" "}
                    <strong>{application.employee_id}</strong>. This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => handleStatus("Rejected")}
                  >
                    Confirm Reject
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </main>
    </div>
  )
}
