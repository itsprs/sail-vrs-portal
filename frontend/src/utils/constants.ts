import type { ApplicationStatus } from "@/types"

export const ROUTES = {
  login: "/login",
  dashboard: "/dashboard",
  apply: "/apply",
  compensation: "/compensation",
  status: "/status",
  adminQueue: "/admin/queue",
  adminQueueDetail: (id: number) => `/admin/queue/${id}`,
} as const

export const STATUS_VARIANT: Record<
  ApplicationStatus,
  "default" | "secondary" | "destructive"
> = {
  Pending: "secondary",
  Approved: "default",
  Rejected: "destructive",
}

export const STATUS_MESSAGE: Record<ApplicationStatus, string> = {
  Pending:
    "Your application is in the queue and awaiting HR review. Applications are processed on a first-come, first-served basis.",
  Approved:
    "Congratulations — your VRS application has been approved by SAIL management.",
  Rejected:
    "Your VRS application was not approved at this time. Please contact HR for further information.",
}
