const deletePartCategoryRouter = require("express").Router();
const pool = require("../db");

/*  Deletes a part from the part_categories table. 
    First checks if there is a part in the part_quantity table with the same internal part number.
    If there are, this function does not allow the user to delete the category information entry.
    Otherwise, the entry is removed. */

deletePartCategoryRouter.post("/", async (req, res) => {
  var part_id = req.body.part_id;
  var part_category_id = req.body.part_category_id;
  var part_category_name = req.body.part_category_name;
  var deletePartCategoryTableQuery = `DELETE FROM part_categories WHERE part_id = '${part_id}' and part_category_name = '${part_category_name}' and part_category_id = ${part_category_id};`;
  var checkIfInUse = `SELECT * FROM part_quantity WHERE internal_part_number ='${part_id}';`;
  var results;

  try {
    const result = await pool.query(checkIfInUse);
    results = result.rows;

    if (results.length < 1) {
      await pool.query(deletePartCategoryTableQuery);
      res.status(200).json(deletePartCategoryTableQuery);
    } else {
      console.log("This part still exists in the inventory!");
    }
  } catch (e) {
    console.log(e);
    res.status(400).end();
  }
});

module.exports = deletePartCategoryRouter;
