import jwt from "jsonwebtoken"

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided." })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." })
  }
}

export const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({
      message: `Access denied. Requires ${role} role.`,
    })
  }
  next()
}
