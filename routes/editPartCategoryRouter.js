const editPartCategoryRouter = require("express").Router();
const pool = require("../db");

/*  Edits an entry in the part category table with the updated information provided by the user.  */

var new_part_category_id;
var part_id;
var part_category_name;

editPartCategoryRouter.post("/", (req, res) => {
  var editPartCategoryTableQuery = `UPDATE part_categories SET part_category_id = ${new_part_category_id}, part_id = '${part_id}', part_category_name = '${part_category_name}' WHERE part_id = ${part_id};`;

  pool.query(editPartCategoryTableQuery, (error, result) => {
    if (error) {
      return;
    }
    res.send(done);
  });
});

module.exports = editPartCategoryRouter;
