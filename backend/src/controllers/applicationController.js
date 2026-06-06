import { pool } from "../db.js"
import { calculatePayout, checkEligibility } from "../utils/vrsCalculator.js"

const VALID_STATUSES = ["Approved", "Rejected"]

export const createApplication = async (req, res) => {
	try {
		const { employee_id } = req.body

		if (!employee_id) {
			return res.status(400).json({ message: "Employee ID is required." })
		}

		const [[employee]] = await pool.query(
			"SELECT * FROM employees WHERE employee_id = ?",
			[employee_id],
		)

		if (!employee) {
			return res.status(404).json({ message: "Employee not found." })
		}

		const eligibility = checkEligibility(employee.dob, employee.doj)

		if (!eligibility.isEligible) {
			return res.status(400).json({
				message: "Employee is not eligible for VRS.",
			})
		}

		const { formulaA, formulaB, finalCompensation } = calculatePayout(
			employee.basic_pay,
			employee.da,
			eligibility.serviceYears,
			eligibility.remainingYears,
		)

		const [result] = await pool.query(
			`INSERT INTO vrs_applications
       (employee_id, formula_a_value, formula_b_value, final_compensation, status)
       VALUES (?, ?, ?, ?, 'Pending')`,
			[employee_id, formulaA, formulaB, finalCompensation],
		)

		res.status(201).json({
			status: "success",
			applicationId: result.insertId,
			message: "Application submitted successfully.",
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Internal server error." })
	}
}

export const getAllApplications = async (_, res) => {
	try {
		const [applications] = await pool.query(`
            SELECT a.*, e.designation_type, e.basic_pay
            FROM vrs_applications a
            JOIN employees e ON a.employee_id = e.employee_id
            ORDER BY a.submission_timestamp DESC
        `)

		res.json(applications)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Internal server error." })
	}
}

export const updateApplicationStatus = async (req, res) => {
	try {
		const { id } = req.params
		const { status } = req.body

		if (!VALID_STATUSES.includes(status)) {
			return res.status(400).json({ message: "Invalid status." })
		}

		const [result] = await pool.query(
			"UPDATE vrs_applications SET status = ? WHERE application_id = ?",
			[status, id],
		)

		if (!result.affectedRows) {
			return res.status(404).json({ message: "Application not found." })
		}

		res.json({
			status: "success",
			message: `Application ${status.toLowerCase()}.`,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Internal server error." })
	}
}
