const categoryRouter = require("express").Router();
const pool = require("../db");

categoryRouter.get("/", (req, res) => {
  //select all parts from part category table
  var categoryTableQuery =
    "SELECT DISTINCT part_category_name FROM part_categories;";

  pool.query(categoryTableQuery, (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    var results = { rows: result.rows };
    res.json(results.rows);
  });
});

module.exports = categoryRouter;
