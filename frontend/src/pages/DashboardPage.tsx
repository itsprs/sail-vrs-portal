import { ClipboardList } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AppHeader from "@/components/AppHeader"
import CompensationCard from "@/components/dashboard/CompensationCard"
import EmployeeProfileCard from "@/components/dashboard/EmployeeProfileCard"
import SalaryCard from "@/components/dashboard/SalaryCard"
import PageError from "@/components/PageError"
import PageLoader from "@/components/PageLoader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { getEmployee } from "@/services/api"
import type { EmployeeResponse } from "@/types"

export default function DashboardPage() {
  const navigate = useNavigate()
  const employeeId = localStorage.getItem("employee_id") ?? ""

  const [data, setData] = useState<EmployeeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getEmployee(employeeId)
      .then(setData)
      .catch(() => setError("Failed to load your profile. Please try again."))
      .finally(() => setLoading(false))
  }, [employeeId])

  if (loading) return <PageLoader message="Loading your profile…" />
  if (error || !data) return <PageError message={error} />

  const { profile, vrsDetails } = data
  const { eligibility, compensation } = vrsDetails

  return (
    <div className="min-h-svh bg-background">
      <AppHeader employeeId={profile.employee_id} />
      <main className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Welcome, {profile.employee_id}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {profile.designation_type} · {profile.role}
            </p>
          </div>
          <Badge
            variant={eligibility.isEligible ? "default" : "secondary"}
            className="text-sm px-3 py-1 self-start sm:self-auto"
          >
            {eligibility.isEligible ? "Eligible for VRS" : "Not Eligible"}
          </Badge>
        </div>
        <EmployeeProfileCard profile={profile} eligibility={eligibility} />
        <SalaryCard profile={profile} compensation={compensation} />
        {compensation && <CompensationCard compensation={compensation} />}
        <Item variant="muted">
          <ItemContent>
            <ItemDescription>Eligibility Status</ItemDescription>
            <ItemTitle className="text-sm font-normal text-muted-foreground">
              {eligibility.message}
            </ItemTitle>
          </ItemContent>
        </Item>
        <div className="flex flex-col sm:flex-row gap-3">
          {eligibility.isEligible && (
            <Button onClick={() => navigate("/apply")} className="gap-2">
              <ClipboardList className="size-4" />
              Apply for VRS
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate("/status")}>
            Check Application Status
          </Button>
        </div>
      </main>
    </div>
  )
}
