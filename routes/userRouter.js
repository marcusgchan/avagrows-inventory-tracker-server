const userRouter = require("express").Router();
const authenticate = require("../authenticate");

userRouter.get("/", authenticate, (req, res) => {
  res.status(200).send(req.user);
});

module.exports = userRouter;
