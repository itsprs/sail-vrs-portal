/**
 * SAIL VRS Business Logic Engine
 * Centralized utility for eligibility and compensation calculations.
 */

// 1. Helper: Calculate absolute years between two dates
export const calculateYears = (startDate, endDate) => {
	const start = new Date(startDate)
	const end = new Date(endDate)
	const diffInMilliseconds = end - start
	// Divide by milliseconds in a year (accounting for leap years)
	return Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25))
}

// 2. Eligibility Engine
export const checkEligibility = (dob, doj, applicationDate = new Date()) => {
	const age = calculateYears(dob, applicationDate)
	const serviceYears = calculateYears(doj, applicationDate)
	const remainingYears = 60 - age // Assuming 60 is the superannuation (retirement) age

	const isEligible = age >= 50 && serviceYears >= 15

	return {
		age,
		serviceYears,
		remainingYears,
		isEligible,
		message: isEligible
			? "Eligible for VRS."
			: "Does not meet the minimum requirement of 50 years of age and 15 years of service.",
	}
}

// 3. Average Credit Point (ACP) Engine for Executives
export const calculateACP = (gradingHistory) => {
	if (!gradingHistory || gradingHistory.length === 0) return 0

	// Sum up all points in the 4-year history
	const totalPoints = gradingHistory.reduce(
		(sum, record) => sum + Number(record.points),
		0,
	)
	return (totalPoints / gradingHistory.length).toFixed(2)
}

// 4. Compensation Engine (Dual-Basket System)
export const calculatePayout = (
	basicPay,
	da,
	completedYears,
	remainingYears,
) => {
	const basic = Number(basicPay)
	const dearnessAllowance = Number(da)

	// SAIL Formula: Daily salary is calculated as (Basic + DA) / 26 days
	const dailySalary = (basic + dearnessAllowance) / 26
	const remainingMonths = remainingYears * 12

	// Formula A: Based on past service and remaining service
	const formulaA =
		35 * dailySalary * completedYears + 25 * dailySalary * remainingYears

	// Formula B: Based strictly on remaining months (Capping formula)
	const formulaB = 30 * dailySalary * remainingMonths

	// The employee gets whichever amount is lower
	const baseAmount = Math.min(formulaA, formulaB)

	// Final payout is 75% of the selected formula
	const finalCompensation = baseAmount * 0.75

	return {
		dailySalary: dailySalary.toFixed(2),
		formulaA: formulaA.toFixed(2),
		formulaB: formulaB.toFixed(2),
		selectedBasket: formulaA < formulaB ? "Formula A" : "Formula B",
		finalCompensation: finalCompensation.toFixed(2),
	}
}
