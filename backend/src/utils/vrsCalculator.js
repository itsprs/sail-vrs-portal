/**
 * SAIL VRS Business Logic Engine
 * Centralized utility for eligibility and compensation calculations.
 */

// 1. Helper: Calculate absolute years between two dates
export const calculateYears = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffInMilliseconds = end - start
  return Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25))
}

// 2. Helper: Calculate precise remaining months until age 60
//    Uses calendar months so Formula B is accurate to the month, not just the year.
const calculateRemainingMonths = (dob, applicationDate = new Date()) => {
  const birth = new Date(dob)
  const superannuation = new Date(
    birth.getFullYear() + 60,
    birth.getMonth(),
    birth.getDate(),
  )
  const diffMs = superannuation - applicationDate
  if (diffMs <= 0) return 0
  // Convert milliseconds → precise months
  return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.4375))
}

// 3. Eligibility Engine
export const checkEligibility = (dob, doj, applicationDate = new Date()) => {
  const age = calculateYears(dob, applicationDate)
  const serviceYears = calculateYears(doj, applicationDate)
  const remainingMonths = calculateRemainingMonths(dob, applicationDate)

  const isEligible = age >= 50 && serviceYears >= 15

  return {
    age,
    serviceYears,
    remainingMonths, // precise — used directly in Formula B
    isEligible,
    message: isEligible
      ? "Eligible for VRS."
      : "Does not meet the minimum requirement of 50 years of age and 15 years of service.",
  }
}

// 4. Average Credit Point (ACP) Engine for Executives
export const calculateACP = (gradingHistory) => {
  if (!gradingHistory || gradingHistory.length === 0) return 0
  const totalPoints = gradingHistory.reduce(
    (sum, record) => sum + Number(record.points),
    0,
  )
  return (totalPoints / gradingHistory.length).toFixed(2)
}

// 5. ACP Eligibility Check for Executives
export const checkACP = (acp, age) => {
  const acpNum = Number(acp)
  if (age >= 57) return { passed: true }
  if (age >= 54) return { passed: acpNum <= 45.0, limit: 45.0 }
  if (age >= 50) return { passed: acpNum <= 42.5, limit: 42.5 }
  return { passed: false }
}

// 6. Compensation Engine (Dual-Basket System)
export const calculatePayout = (
  basicPay,
  da,
  completedYears,
  remainingMonths, // now passed as precise months, not years
) => {
  const basic = Number(basicPay)
  const dearnessAllowance = Number(da)

  // SAIL Formula: Daily salary = (Basic + DA) / 26 days
  const dailySalary = (basic + dearnessAllowance) / 26

  // Formula A: Past service + remaining service (in years)
  const remainingYearsApprox = remainingMonths / 12
  const formulaA =
    35 * dailySalary * completedYears + 25 * dailySalary * remainingYearsApprox

  // Formula B: Remaining months before superannuation at 60
  const formulaB = 30 * dailySalary * remainingMonths

  const baseAmount = Math.min(formulaA, formulaB)
  const finalCompensation = baseAmount * 0.75

  return {
    dailySalary: dailySalary.toFixed(2),
    formulaA: formulaA.toFixed(2),
    formulaB: formulaB.toFixed(2),
    selectedBasket: formulaA <= formulaB ? "Formula A" : "Formula B",
    finalCompensation: finalCompensation.toFixed(2),
  }
}
