const deletePartCategoryRouter = require("express").Router();
const pool = require("../db");

/*  Deletes a part from the part_categories table. 
    First checks if there is a part in the part_quantity table with the same internal part number.
    If there are, this function does not allow the user to delete the category information entry.
    Otherwise, the entry is removed. */

var part_id;

deletePartCategoryRouter.post("/", async (req, res) => {
  var deletePartCategoryTableQuery = `DELETE FROM part_categories WHERE part_id = ${part_id};`;
  var checkIfInUse = `SELECT * FROM part_quantity WHERE internal_part_number = ${part_id};`;
  var results;

  try {
    const result = await pool.query(checkIfInUse);
    results = result.rows;

    if (results.length < 1) {
      await pool.query(deletePartCategoryTableQuery);
    } else {
      console.log("This part still exists in the inventory!");
    }
  } catch (e) {
    console.log(e);
    return;
  }
});

module.exports = deletePartCategoryRouter;
