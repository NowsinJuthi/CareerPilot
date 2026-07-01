const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      // 1. Check if user exists (must come after authMiddleware)
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. User not found.",
        });
      }

      // 2. Check role permission
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You do not have permission.",
        });
      }

      // 3. Allow request
      next();

    } catch (error) {
      console.error("Role Middleware Error:", error.message);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

module.exports = roleMiddleware;