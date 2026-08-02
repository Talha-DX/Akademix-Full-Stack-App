// Role-authorization middleware. Use after requireAuth. Rejects the
// request unless req.user.role is one of the allowed roles for this route.
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: 'Forbidden for this role' })
    }
    next()
  }
}
