const queryForGetPartCategoryRouter = require("express").Router();
const pool = require("../db");

queryForGetPartCategoryRouter.get("/", (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuery = "SELECT * FROM part_categories";

  pool.query(queryPartsQuery, (error, result) => {
    if (error) {  
      console.log(error);
      res.status(200).end();
      
    }
    var results = result.rows;
    res.json(results);
    
  });
});

module.exports = queryForGetPartCategoryRouter;
