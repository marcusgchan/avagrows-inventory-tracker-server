const wipRouter = require("express").Router();
const { json } = require("express/lib/response");
const pool = require("../db");
const authenticate = require("../authenticate");

wipRouter.get("/", authenticate, (req, res) => {
  var wipTableQuery = "SELECT * FROM wip;";

  pool.query(wipTableQuery, (error, result) => {
    if (error) {
      return res.status(400).send(error);
    }
    var results = { rows: result.rows };
    res.status(200).json(results.rows);
  });
});

module.exports = wipRouter;
