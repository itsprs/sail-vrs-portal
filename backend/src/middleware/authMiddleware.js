import jwt from "jsonwebtoken"

/**
 * authenticate
 * Verifies the Bearer JWT on every protected route.
 * Attaches { employee_id, role } to req.user on success.
 */
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

/**
 * requireRole
 * Factory that returns a middleware enforcing a specific role.
 * Usage: requireRole("Admin") or requireRole("Employee")
 */
export const requireRole = (role) => (req, res, next) => {
	if (req.user?.role !== role) {
		return res.status(403).json({
			message: `Access denied. Requires ${role} role.`,
		})
	}
	next()
}
