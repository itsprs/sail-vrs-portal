import axios from "axios"
import type {
  EmployeeResponse,
  LoginRequest,
  LoginResponse,
  UpdateStatusRequest,
  VRSApplication,
} from "@/types"

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

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", data)
  return res.data
}

export const getEmployee = async (id: string): Promise<EmployeeResponse> => {
  const res = await api.get<EmployeeResponse>(`/employees/${id}`)
  return res.data
}

export const submitApplication = async (
  employee_id: string,
): Promise<{ applicationId: number; message: string }> => {
  const res = await api.post("/applications", { employee_id })
  return res.data
}

export const getAllApplications = async (): Promise<VRSApplication[]> => {
  const res = await api.get<VRSApplication[]>("/applications")
  return res.data
}

export const getApplication = async (id: number): Promise<VRSApplication> => {
  const res = await api.get<VRSApplication>(`/applications/${id}`)
  return res.data
}

export const updateApplicationStatus = async (
  id: number,
  data: UpdateStatusRequest,
): Promise<{ message: string }> => {
  const res = await api.patch(`/applications/${id}/status`, data)
  return res.data
}

export default api
