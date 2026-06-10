import express from "express"
import {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
} from "../controllers/applicationController.js"
import { authenticate } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", authenticate, createApplication)
router.get("/", authenticate, getAllApplications)
router.get("/:id", authenticate, getApplicationById)
router.patch("/:id/status", authenticate, updateApplicationStatus)

export default router
