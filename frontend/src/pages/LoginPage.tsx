import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { login } from "@/services/api"

export default function LoginPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")
    if (token && role) {
      navigate(role === "Admin" ? "/admin/queue" : "/dashboard", {
        replace: true,
      })
    }
  }, [navigate])

  const [employeeId, setEmployeeId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await login({ employee_id: employeeId, password })
      localStorage.setItem("token", res.token)
      localStorage.setItem("role", res.role)
      localStorage.setItem("employee_id", employeeId)
      navigate(res.role === "Admin" ? "/admin/queue" : "/dashboard", {
        replace: true,
      })
    } catch (err: unknown) {
      const axiosMsg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message
      setError(axiosMsg ?? "Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 bg-foreground flex-col justify-between p-12">
        <img src="/favicon.svg" alt="SAIL Logo" className="size-10" />
        <div>
          <p className="text-muted text-xs uppercase tracking-widest mb-4 opacity-50">
            Steel Authority of India Limited
          </p>
          <h1 className="text-background text-4xl font-semibold leading-tight tracking-tight">
            Voluntary
            <br />
            Retirement
            <br />
            Scheme
          </h1>
          <p className="text-background opacity-40 text-sm mt-4 max-w-xs leading-relaxed">
            A voluntary option for eligible SAIL employees to retire before the
            age of 60 — with a compensation package and continued retirement
            benefits.
          </p>
        </div>
        <p className="text-background opacity-20 text-xs">
          Implemented from 20 May 2026 · Applications processed first-come,
          first-served
        </p>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <img src="/favicon.svg" alt="SAIL Logo" className="size-10" />
            <span className="text-foreground text-sm font-medium">
              SAIL VRS Portal
            </span>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">
              Sign in
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Enter your employee credentials to continue
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="employee_id">Employee ID</FieldLabel>
                <Input
                  id="employee_id"
                  type="text"
                  placeholder="e.g. EMP001"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                  autoFocus
                  autoComplete="username"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </Field>
              {error && <FieldError>{error}</FieldError>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </FieldGroup>
          </form>
          <p className="text-muted-foreground text-xs text-center mt-8 leading-relaxed">
            Access is restricted to authorised SAIL employees only.
            <br />
            Contact HR if you face issues signing in.
          </p>
        </div>
      </div>
    </div>
  )
}
