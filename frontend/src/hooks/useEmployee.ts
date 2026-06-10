import { useEffect, useState } from "react"
import { getEmployee } from "@/services/api"
import type { EmployeeResponse } from "@/types"

interface UseEmployeeResult {
  data: EmployeeResponse | null
  loading: boolean
  error: string
}

export const useEmployee = (employeeId: string): UseEmployeeResult => {
  const [data, setData] = useState<EmployeeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!employeeId) return
    setLoading(true)
    getEmployee(employeeId)
      .then(setData)
      .catch(() => setError("Failed to load employee profile."))
      .finally(() => setLoading(false))
  }, [employeeId])

  return { data, loading, error }
}
