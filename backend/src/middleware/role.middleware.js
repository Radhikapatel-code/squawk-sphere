module.exports = (allowedRoles) => {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.dbUser.role)) {
        return res.status(403).json({ error: "Access denied" });
      }
      next();
    };
  };
  