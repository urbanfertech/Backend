export const allowRoles = (...roles) => {
  return (req, res, next) => {
    // console.log(req.user);
    // console.log(roles)
    if(!req.user) return res.status(401).json({ message: "User not logged in" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }
    next();
  };
};
