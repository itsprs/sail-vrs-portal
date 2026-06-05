import express from "express"
import { getEmployeeById } from "../controllers/employeeController.js"

const router = express.Router()

router.get("/:id", getEmployeeById)

export default router
