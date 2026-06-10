import { ClipboardList, LayoutDashboard } from "lucide-react"
import { useNavigate } from "react-router-dom"
import CompensationCard from "@/components/dashboard/CompensationCard"
import EmployeeProfileCard from "@/components/dashboard/EmployeeProfileCard"
import SalaryCard from "@/components/dashboard/SalaryCard"
import PageError from "@/components/PageError"
import PageLoader from "@/components/PageLoader"
import PageShell from "@/components/shared/PageShell"
import SectionHeader from "@/components/shared/SectionHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { useAuth } from "@/hooks/useAuth"
import { useEmployee } from "@/hooks/useEmployee"
import { ROUTES } from "@/utils/constants"

export default function DashboardPage() {
  const navigate = useNavigate()
  const { employeeId } = useAuth()
  const { data, loading, error } = useEmployee(employeeId)

  if (loading) return <PageLoader message="Loading your profile…" />
  if (error || !data) return <PageError message={error} />

  const { profile, vrsDetails } = data
  const { eligibility, compensation } = vrsDetails

  return (
    <PageShell employeeId={profile.employee_id}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeader
          icon={LayoutDashboard}
          title={`Welcome, ${profile.employee_id}`}
          description={`${profile.designation_type} · ${profile.role}`}
        />
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
          <Button onClick={() => navigate(ROUTES.apply)} className="gap-2">
            <ClipboardList className="size-4" />
            Apply for VRS
          </Button>
        )}
        <Button variant="outline" onClick={() => navigate(ROUTES.status)}>
          Check Application Status
        </Button>
      </div>
    </PageShell>
  )
}
