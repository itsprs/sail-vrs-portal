import { pool } from "../db.js"
import {
	calculateACP,
	calculatePayout,
	checkEligibility,
} from "../utils/vrsCalculator.js"

export const getEmployeeById = async (req, res) => {
	try {
		const { id } = req.params

		const [[employee]] = await pool.query(
			"SELECT * FROM employees WHERE employee_id = ?",
			[id],
		)

		if (!employee) {
			return res.status(404).json({ message: "Employee not found." })
		}

		const gradingHistory =
			employee.designation_type === "Executive"
				? (
						await pool.query(
							`SELECT appraisal_year, grade, points
               FROM grading_history
               WHERE employee_id = ?
               ORDER BY appraisal_year DESC`,
							[id],
						)
					)[0]
				: []

		const eligibility = checkEligibility(employee.dob, employee.doj)
		const averageCreditPoint = calculateACP(gradingHistory)

		const compensation = eligibility.isEligible
			? calculatePayout(
					employee.basic_pay,
					employee.da,
					eligibility.serviceYears,
					eligibility.remainingYears,
				)
			: null

		res.json({
			profile: employee,
			gradingHistory,
			vrsDetails: {
				eligibility,
				averageCreditPoint,
				compensation,
			},
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Internal server error" })
	}
}
