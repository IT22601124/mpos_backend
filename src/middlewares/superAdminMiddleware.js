const superAdminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  // Assuming role_id 3 is Super Admin
  if (req.user.role_id !== 3 && req.user.role_id !== '3') {
    return res.status(403).json({
      message: "Access denied. Super Admin privileges required.",
    });
  }

  next();
};

export default superAdminMiddleware;
