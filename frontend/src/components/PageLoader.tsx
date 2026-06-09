import { Spinner } from "@/components/ui/spinner"

interface PageLoaderProps {
  message?: string
}

export default function PageLoader({ message = "Loading…" }: PageLoaderProps) {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center gap-3 text-muted-foreground">
      <Spinner className="size-5" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
