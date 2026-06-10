import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import StatusBadge from "@/components/shared/StatusBadge"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { updateApplicationStatus } from "@/services/api"
import type { VRSApplication } from "@/types"
import { ROUTES } from "@/utils/constants"
import { extractErrorMessage } from "@/utils/errors"
import { formatCurrency, formatDateTime } from "@/utils/format"

interface ApplicationsTableProps {
  applications: VRSApplication[]
  onStatusChange: () => void
}

export default function ApplicationsTable({
  applications,
  onStatusChange,
}: ApplicationsTableProps) {
  const navigate = useNavigate()

  const handleStatus = async (id: number, status: "Approved" | "Rejected") => {
    try {
      await updateApplicationStatus(id, { status })
      toast.success(`Application ${status.toLowerCase()} successfully.`)
      onStatusChange()
    } catch (err) {
      toast.error(extractErrorMessage(err))
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>Employee ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead className="text-right">Compensation</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((app, index) => (
          <TableRow
            key={app.application_id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() =>
              navigate(ROUTES.adminQueueDetail(app.application_id))
            }
          >
            <TableCell className="text-muted-foreground text-xs">
              {index + 1}
            </TableCell>
            <TableCell className="font-medium">{app.employee_id}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {app.designation_type}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDateTime(app.submission_timestamp)}
            </TableCell>
            <TableCell className="text-right font-medium">
              {formatCurrency(app.final_compensation)}
            </TableCell>
            <TableCell>
              <StatusBadge status={app.status} />
            </TableCell>
            <TableCell className="text-right">
              {app.status === "Pending" && (
                <div
                  className="flex justify-end gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        Approve
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Approve Application?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Approve for <strong>{app.employee_id}</strong> —{" "}
                          <strong>
                            {formatCurrency(app.final_compensation)}
                          </strong>
                          . This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleStatus(app.application_id, "Approved")
                          }
                        >
                          Confirm Approve
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        Reject
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reject Application?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Reject application for{" "}
                          <strong>{app.employee_id}</strong>. This cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() =>
                            handleStatus(app.application_id, "Rejected")
                          }
                        >
                          Confirm Reject
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
