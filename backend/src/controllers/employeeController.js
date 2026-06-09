import bcrypt from "bcryptjs"
import { pool } from "../db.js"
import {
  calculateACP,
  calculatePayout,
  checkEligibility,
} from "../utils/vrsCalculator.js"

export const createEmployee = async (req, res) => {
  try {
    const {
      employee_id,
      designation_type,
      dob,
      doj,
      basic_pay,
      da,
      password,
      grading_history,
    } = req.body

    if (
      !employee_id ||
      !designation_type ||
      !dob ||
      !doj ||
      !basic_pay ||
      !da ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required." })
    }

    if (!["Executive", "Non-Executive"].includes(designation_type)) {
      return res.status(400).json({
        message: "designation_type must be 'Executive' or 'Non-Executive'.",
      })
    }

    if (designation_type === "Executive") {
      if (!Array.isArray(grading_history) || grading_history.length === 0) {
        return res.status(400).json({
          message:
            "Executives must provide grading_history (array of up to 4 years).",
        })
      }
      if (grading_history.length > 4) {
        return res.status(400).json({
          message: "grading_history must not exceed 4 entries.",
        })
      }
    }

    const [[existing]] = await pool.query(
      "SELECT employee_id FROM employees WHERE employee_id = ?",
      [employee_id],
    )
    if (existing) {
      return res.status(409).json({ message: "Employee ID already exists." })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await pool.query(
      `INSERT INTO employees (employee_id, designation_type, dob, doj, basic_pay, da, password)
			 VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [employee_id, designation_type, dob, doj, basic_pay, da, hashedPassword],
    )

    if (designation_type === "Executive" && grading_history?.length > 0) {
      const gradingRows = grading_history.map(
        ({ appraisal_year, grade, points }) => [
          employee_id,
          appraisal_year,
          grade,
          points,
        ],
      )
      await pool.query(
        `INSERT INTO grading_history (employee_id, appraisal_year, grade, points)
				 VALUES ?`,
        [gradingRows],
      )
    }

    res.status(201).json({
      status: "success",
      message: "Employee registered successfully.",
      employee_id,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error." })
  }
}

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
          eligibility.remainingMonths,
        )
      : null

    const { password: _, ...safeProfile } = employee

    res.json({
      profile: safeProfile,
      gradingHistory,
      vrsDetails: {
        eligibility,
        averageCreditPoint,
        compensation,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error." })
  }
}
