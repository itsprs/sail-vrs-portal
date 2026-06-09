export interface LoginRequest {
  employee_id: string
  password: string
}

export interface LoginResponse {
  status: string
  token: string
  role: "Employee" | "Admin"
}

export interface GradingHistory {
  appraisal_year: string
  grade: string
  points: number
}

export interface Employee {
  employee_id: string
  designation_type: "Executive" | "Non-Executive"
  dob: string
  doj: string
  basic_pay: number
  da: number
  role: "Employee" | "Admin"
  created_at: string
}

export interface Eligibility {
  age: number
  serviceYears: number
  remainingMonths: number
  isEligible: boolean
  message: string
}

export interface Compensation {
  dailySalary: string
  formulaA: string
  formulaB: string
  selectedBasket: "Formula A" | "Formula B"
  finalCompensation: string
}

export interface VRSDetails {
  eligibility: Eligibility
  averageCreditPoint: string
  compensation: Compensation | null
}

export interface EmployeeResponse {
  profile: Employee
  gradingHistory: GradingHistory[]
  vrsDetails: VRSDetails
}

export type ApplicationStatus = "Pending" | "Approved" | "Rejected"

export interface VRSApplication {
  application_id: number
  employee_id: string
  submission_timestamp: string
  status: ApplicationStatus
  formula_a_value: number
  formula_b_value: number
  final_compensation: number
  designation_type: "Executive" | "Non-Executive"
  basic_pay: number
}

export interface UpdateStatusRequest {
  status: "Approved" | "Rejected"
}

export interface AuthUser {
  employee_id: string
  role: "Employee" | "Admin"
  token: string
}
