import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface PageErrorProps {
  message?: string
}

export default function PageError({
  message = "Something went wrong. Please try again.",
}: PageErrorProps) {
  return (
    <div className="min-h-svh flex items-center justify-center p-6">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="size-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  )
}
