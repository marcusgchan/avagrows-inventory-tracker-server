const queryForEditPartCategoryRouter = require("express").Router();
const pool = require("../db");

queryForEditPartCategoryRouter.get("/", (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuery = "SELECT * FROM part_categories where part_id = 'MTL0139'";

  pool.query(queryPartsQuery, (error, result) => {
    if (error) {  
      console.log(error);
      res.status(200).end();
      
    }
    var results = result.rows;
    res.json(results);
    
  });
});

module.exports = queryForEditPartCategoryRouter;
