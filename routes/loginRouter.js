const loginRouter = require("express").Router();
const passport = require("passport");

loginRouter.post(
  "/",
  passport.authenticate("local", { session: true }),
  (req, res) => {
    res.send(req.user);
  }
);

module.exports = loginRouter;
