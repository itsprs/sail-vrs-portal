import express from "express"
import {
  createApplication,
  getAllApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js"

const router = express.Router()

router.post("/", createApplication)
router.get("/", getAllApplications)
router.patch("/:id/status", updateApplicationStatus)

export default router
