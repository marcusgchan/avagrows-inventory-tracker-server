function authenticate(req, res, next) {
  if (req.user) {
    next();
    return;
  }
  res.status(401).json({ msg: "Not logged in" });
}

module.exports = authenticate;
