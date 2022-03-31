const addPartCategoryRouter = require("express").Router();
const req = require("express/lib/request");
const pool = require("../db");

//add to part category table
addPartCategoryRouter.post("/", (req, res) => {
  let { 
    part_category_id,
    part_id,
    part_category_name,
  } = req.body
  var addPartCategoryTableQuery = `INSERT into part_categories values(${part_category_id},'${part_id}','${part_category_name}');`;

  // Query to add part + category into table.
  pool.query(addPartCategoryTableQuery, (error, result) => {
    if (error) {
      res.status(200).json("error")
    }
    res.status(200).json("done")
  });
});

module.exports = addPartCategoryRouter;
