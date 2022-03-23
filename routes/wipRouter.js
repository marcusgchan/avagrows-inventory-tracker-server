const wipRouter = require("express").Router();
const pool = require("../db");

wipRouter.get("/", (req, res) => {
  var wipTableQuery = "SELECT * FROM wip;";

  pool.query(partsTableQuery, (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    var results = { rows: result.rows };
    res.json(results.rows);
  });
});

module.exports = wipRouter;
