import { pool } from "../db.js"

export const getEmployeeById = async (req, res) => {
	try {
		const { id } = req.params
		const [rows] = await pool.query(
			"SELECT * FROM employees WHERE employee_id = ?",
			[id],
		)
		const employee = rows[0]

		if (!employee)
			return res.status(404).json({ message: "Employee not found." })

		let gradingHistory = []

		if (employee.designation_type === "Executive") {
			;[gradingHistory] = await pool.query(
				`SELECT appraisal_year, grade, points
				FROM grading_history
				WHERE employee_id = ?
				ORDER BY appraisal_year DESC`,
				[id],
			)
		}

		res.json({ profile: employee, gradingHistory })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Internal server error" })
	}
}
