import dotenv from "dotenv"
import mysql from "mysql2/promise"

dotenv.config()

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  // todo: remove ssl config when deploying to production
  ssl: {
    rejectUnauthorized: false,
  },
})
