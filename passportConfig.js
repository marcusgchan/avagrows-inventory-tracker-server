const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const pool = require("./db.js");

async function getUserBy(column, value) {
  return pool.query(`SELECT * FROM users WHERE ${column} = '${value}'`);
}

module.exports = function (passport) {
  async function authenticateUser(username, password, done) {
    getUserBy("username", username)
      .then((data) => {
        if (data.rows.length > 0) {
          const user = data.rows[0];
          bcrypt
            .compare(password, user.password)
            .then((isCorrectPassword) => {
              return isCorrectPassword
                ? done(null, user)
                : done(null, false, { message: "Password is incorrect" });
            })
            .catch((err) => {
              return done(err, false, {
                message: "Unable to call bcrypt.compare()",
              });
            });
        } else {
          return done(null, false, { message: "incorrect username" });
        }
      })
      .catch((err) => {
        done(err, false, { message: "Unable to query database" });
      });
  }

  passport.use(new LocalStrategy(authenticateUser));

  passport.serializeUser((user, done) => {
    // Creates cookie in browser
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    // Deserilize cookie
    getUserBy("id", id)
      .then((data) => {
        if (data.rows.length > 0) {
          const user = data.rows[0];
          done(null, user);
        }
      })
      .catch((err) => {
        done(err, false, {
          message: "unable to deserialize user or query database",
        });
      });
  });
};
