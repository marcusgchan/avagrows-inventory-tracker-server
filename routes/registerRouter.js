const registerRouter = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

// Create user
registerRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (username === undefined || password === undefined) {
    res.status(400).json({ msg: "Bad request" });
  }

  // Verify email format

  const hashedPassword = await bcrypt.hash(password, 10);

  pool
    .query(`SELECT * FROM users WHERE username = '${username}'`)
    .then((data) => {
      // Runs if user table contains user with the same email
      if (data.rows.length > 0) {
        res.status(400).json({ msg: "user already exists" });
        return;
      }
      // Otherwise add user
      pool
        .query(
          `INSERT INTO users (username, password) VALUES ('${username}', '${hashedPassword}')`
        )
        .then((data) => res.json({ msg: "created user" }))
        .catch((err) => res.status(500).json({ msg: "unable to create user" }));
    })
    .catch((err) => {
      res.status(500).json({ msg: "Unable to query database" });
    });
});

module.exports = registerRouter;
