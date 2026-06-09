import { Briefcase, CalendarDays, Clock, UserRound } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import type { Eligibility, Employee } from "@/types"
import { formatDate } from "@/utils/format"

interface EmployeeProfileCardProps {
  profile: Employee
  eligibility: Eligibility
}

export default function EmployeeProfileCard({
  profile,
  eligibility,
}: EmployeeProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <UserRound className="size-4 text-muted-foreground" />
          Employee Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ItemGroup>
          <Item size="sm">
            <ItemMedia variant="icon">
              <CalendarDays className="size-4" />
            </ItemMedia>
            <ItemContent>
              <ItemDescription>Date of Birth</ItemDescription>
              <ItemTitle>{formatDate(profile.dob)}</ItemTitle>
            </ItemContent>
          </Item>
          <Item size="sm">
            <ItemMedia variant="icon">
              <Briefcase className="size-4" />
            </ItemMedia>
            <ItemContent>
              <ItemDescription>Date of Joining</ItemDescription>
              <ItemTitle>{formatDate(profile.doj)}</ItemTitle>
            </ItemContent>
          </Item>
          <Item size="sm">
            <ItemMedia variant="icon">
              <UserRound className="size-4" />
            </ItemMedia>
            <ItemContent>
              <ItemDescription>Age</ItemDescription>
              <ItemTitle>{eligibility.age} years</ItemTitle>
            </ItemContent>
          </Item>
          <Item size="sm">
            <ItemMedia variant="icon">
              <Clock className="size-4" />
            </ItemMedia>
            <ItemContent>
              <ItemDescription>Years of Service</ItemDescription>
              <ItemTitle>{eligibility.serviceYears} years</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
