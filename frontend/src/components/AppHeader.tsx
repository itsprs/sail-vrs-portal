import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

interface AppHeaderProps {
  employeeId: string
}

export default function AppHeader({ employeeId }: AppHeaderProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login", { replace: true })
  }

  return (
    <header className="border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="/favicon.svg" alt="SAIL" className="size-7" />
        <span className="text-sm font-medium text-foreground">
          SAIL VRS Portal
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground hidden sm:block">
          {employeeId}
        </span>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut />
          Sign out
        </Button>
      </div>
    </header>
  )
}
