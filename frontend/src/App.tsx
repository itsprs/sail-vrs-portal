import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import ApplyPage from "@/pages/ApplyPage"
import ApplicationDetailPage from "@/pages/admin/ApplicationDetailPage"
import QueuePage from "@/pages/admin/QueuePage"
import CompensationPage from "@/pages/CompensationPage"
import DashboardPage from "@/pages/DashboardPage"
import LoginPage from "@/pages/LoginPage"
import StatusPage from "@/pages/StatusPage"
import ProtectedRoute from "@/routes/ProtectedRoute"

export default function App() {
  const role = localStorage.getItem("role")

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <Navigate
              to={
                role === "Admin"
                  ? "/admin/queue"
                  : role === "Employee"
                    ? "/dashboard"
                    : "/login"
              }
              replace
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply"
          element={
            <ProtectedRoute>
              <ApplyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compensation"
          element={
            <ProtectedRoute>
              <CompensationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/status"
          element={
            <ProtectedRoute>
              <StatusPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/queue"
          element={
            <ProtectedRoute requiredRole="Admin">
              <QueuePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/queue/:id"
          element={
            <ProtectedRoute requiredRole="Admin">
              <ApplicationDetailPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
