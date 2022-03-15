const deletePartCategoryRouter = require("express").Router();
const pool = require("../db");
var part_id;

deletePartCategoryRouter.post("/", async (req, res) => {
  var deleteLocationTableQuery = `DELETE FROM part_categories WHERE part_id = ${part_id};`;
  var checkIfInUse = `SELECT * FROM part_quantity WHERE internal_part_number = ${part_id};`;
  var results;

  try {
    const result = await pool.query(checkIfInUse);
    results = result.rows;

    if (results.length < 1) {
      await pool.query(deleteLocationTableQuery);
    } else {
      console.log("This part still exists in the inventory!");
    }
  } catch (e) {
    console.log(e);
    return;
  }
});

module.exports = deletePartCategoryRouter;
