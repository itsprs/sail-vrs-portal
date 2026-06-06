import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { pool } from "../db.js"

export const login = async (req, res) => {
	try {
		const { employee_id, password } = req.body

		if (!employee_id || !password) {
			return res
				.status(400)
				.json({ message: "Employee ID and password are required." })
		}

		const [[employee]] = await pool.query(
			"SELECT employee_id, password, role FROM employees WHERE employee_id = ?",
			[employee_id],
		)

		const isMatch = await bcrypt.compare(password, employee.password)
		if (!employee || !isMatch) {
			return res.status(401).json({ message: "Invalid credentials." })
		}

		const token = jwt.sign(
			{ employee_id: employee.employee_id, role: employee.role },
			process.env.JWT_SECRET,
			{ expiresIn: "8h" },
		)

		res.json({
			status: "success",
			token,
			role: employee.role,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Internal server error." })
	}
}
