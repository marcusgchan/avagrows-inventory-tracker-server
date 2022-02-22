const logoutRouter = require("express").Router();

logoutRouter.get("/", (req, res) => {
  req.logout();
  res.json({ msg: "Logged out" });
});

module.exports = logoutRouter;
