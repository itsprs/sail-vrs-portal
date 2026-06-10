import { useCallback, useEffect, useState } from "react"
import { getAllApplications } from "@/services/api"
import type { VRSApplication } from "@/types"

interface UseApplicationsResult {
  applications: VRSApplication[]
  loading: boolean
  error: string
  refetch: () => void
}

export const useApplications = (): UseApplicationsResult => {
  const [applications, setApplications] = useState<VRSApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const refetch = useCallback(() => {
    setLoading(true)
    getAllApplications()
      .then(setApplications)
      .catch(() => setError("Failed to load applications."))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { applications, loading, error, refetch }
}
