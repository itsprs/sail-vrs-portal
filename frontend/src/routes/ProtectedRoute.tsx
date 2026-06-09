import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "Employee" | "Admin"
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role") as "Employee" | "Admin" | null

  if (!token || !role) return <Navigate to="/login" replace />
  if (requiredRole && role !== requiredRole)
    return (
      <Navigate to={role === "Admin" ? "/admin/queue" : "/dashboard"} replace />
    )

  return <>{children}</>
}
