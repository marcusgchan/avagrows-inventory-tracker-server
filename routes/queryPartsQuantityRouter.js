const queryPartsQuantityRouter = require("express").Router();
const pool = require("../db");

queryPartsQuantityRouter.get("/", (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuantityQuery =
    "SELECT * FROM part_quantity;";

  pool.query(queryPartsQuantityQuery, (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    var results = { rows: result.rows };
    res.json(results.rows);
  });
});

module.exports = queryPartsQuantityRouter;
