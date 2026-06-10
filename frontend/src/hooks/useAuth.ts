import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/utils/constants"

export interface AuthUser {
  token: string
  role: "Employee" | "Admin"
  employeeId: string
}

export const useAuth = (): AuthUser & { logout: () => void } => {
  const navigate = useNavigate()

  const token = localStorage.getItem("token") ?? ""
  const role = (localStorage.getItem("role") ?? "Employee") as
    | "Employee"
    | "Admin"
  const employeeId = localStorage.getItem("employee_id") ?? ""

  const logout = () => {
    localStorage.clear()
    navigate(ROUTES.login, { replace: true })
  }

  return { token, role, employeeId, logout }
}
