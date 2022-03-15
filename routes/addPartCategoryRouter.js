const addPartCategoryRouter = require("express").Router();
const pool = require("../db");
var part_category_id;
var part_id;
var part_category_name;

addPartCategoryRouter.post("/", (req, res) => {
  var addPartCategoryTableQuery = `INSERT into locations values(${part_category_id},'${part_id}','${part_category_name}');`;

  pool.query(addPartCategoryTableQuery, (error, result) => {
    if (error) {
      return;
    }
    res.send(done);
  });
});

module.exports = addPartCategoryRouter;
