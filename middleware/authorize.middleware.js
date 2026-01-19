const authorize = (...roles) => {
  const role = req?.token?.role;
  if (!role || !roles.includes(role)) {
    res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = authorize;
