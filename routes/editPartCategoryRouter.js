const editPartCategoryRouter = require("express").Router();
const req = require("express/lib/request");
const pool = require("../db");

/*  Edits an entry in the part category table with the updated information provided by the user.  */

editPartCategoryRouter.post("/", (req, res) => {
  let {
    new_part_category_id,
    part_id,
    part_category_name,
  } = req.body
  var editPartCategoryTableQuery = `UPDATE part_categories SET part_category_id = ${new_part_category_id}, part_id = '${part_id}', part_category_name = '${part_category_name}' WHERE part_id = '${part_id}';`;

  pool.query(editPartCategoryTableQuery, (error, result) => {
    if (error) {
      res.status(400).json("error")
    }
    res.status(200).json("done");
  });
});

module.exports = editPartCategoryRouter;
