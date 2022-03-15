const statusRouter = require("express").Router();
const pool = require("../db");

statusRouter.get("/", (req, res) => {
  var statusTableQuery = "SELECT * FROM statuses;";

  pool.query(statusTableQuery, (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    var results = { rows: result.rows };
    res.json(results.rows);
  });
});

module.exports = statusRouter;
