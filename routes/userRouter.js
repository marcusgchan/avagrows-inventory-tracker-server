const userRouter = require("express").Router();

userRouter.get("/", (req, res) => {
  // If user is logged in (passport deserializes cookie and stores in session)
  if (req.user) {
    return res.status(200).send(req.user);
  }

  res.status(401).json({ msg: "Not logged in" });
});

module.exports = userRouter;
