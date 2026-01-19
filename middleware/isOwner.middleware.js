const isOwner = (err, req, res, next) => {
  const { id } = req.params;
  const { userId } = req.token;

  if (!userId) {
    res.status(401).json({ message: "unauthorized" });
  }

  if (userId !== id) {
    res.status(403).json({ message: "access denied" });
  }

  next();
};

module.exports = isOwner;
