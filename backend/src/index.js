import cors from "cors"
import express from "express"
import { pool } from "./db.js"

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
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

app.listen(PORT, () =>
	console.log(`🚀 Server running at http://localhost:${PORT}`),
)
