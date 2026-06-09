import axios from "axios"
import type { EmployeeResponse, LoginResponse, VRSApplication } from "@/types"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authService = {
  login: async (
    employee_id: string,
    password: string,
  ): Promise<LoginResponse> => {
    const { data } = await api.post("/auth/login", { employee_id, password })
    return data
  },
}

export const employeeService = {
  getProfile: async (id: string): Promise<EmployeeResponse> => {
    const { data } = await api.get(`/employees/${id}`)
    return data
  },
}

export const applicationService = {
  submitApplication: async (): Promise<void> => {
    await api.post("/applications")
  },
  getAllApplications: async (): Promise<VRSApplication[]> => {
    const { data } = await api.get("/applications")
    return data
  },
  updateStatus: async (
    id: number,
    status: "Approved" | "Rejected",
  ): Promise<void> => {
    await api.patch(`/applications/${id}/status`, { status })
  },
}
