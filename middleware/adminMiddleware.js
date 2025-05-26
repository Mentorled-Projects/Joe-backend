const onlyAdmin = (req, res, next) => {
  if (!req.admin) {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

module.exports = onlyAdmin