const partsRouter = require("express").Router();
const pool = require("../db");

partsRouter.get("/", (req, res) => {
  var partsTableQuery = "SELECT * FROM parts;";

  pool.query(partsTableQuery, (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    var results = { rows: result.rows };
    res.json(results.rows);
  });
});

module.exports = partsRouter;
