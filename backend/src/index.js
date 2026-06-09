import cors from "cors"
import express from "express"
import { pool } from "./db.js"
import applicationRoutes from "./routes/applicationRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import employeeRoutes from "./routes/employeeRoutes.js"

const app = express()
const PORT = process.env.PORT || 5000

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
)
app.use(express.json())

app.get("/api/health", async (_, res) => {
  try {
    await pool.query("SELECT 1")
    res.json({
      status: "success",
      message: "API running",
      database: "connected",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
    })
  }
})

app.use("/api/auth", authRoutes)
app.use("/api/employees", employeeRoutes)
app.use("/api/applications", applicationRoutes)

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`),
)
