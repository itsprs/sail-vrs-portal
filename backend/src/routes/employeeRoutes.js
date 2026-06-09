import express from "express"
import {
  createEmployee,
  getEmployeeById,
} from "../controllers/employeeController.js"
import { authenticate, requireRole } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", authenticate, requireRole("Admin"), createEmployee)
router.get("/:id", authenticate, getEmployeeById)

export default router
