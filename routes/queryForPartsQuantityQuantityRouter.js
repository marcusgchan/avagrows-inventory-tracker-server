const queryForPartsQuantityQuantityRouter = require("express").Router();
const pool = require("../db");

queryForPartsQuantityQuantityRouter.get("/", (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuantityQuery = "SELECT * FROM part_quantity where internal_part_number='2MP04' and location_id = 1 and status_id=1;";

  pool.query(queryPartsQuantityQuery, (error, result) => {
    if (error) {  
      console.log(error);
      res.status(200).end();
      
    }
    var results = result.rows[0].quantity;
    res.json(results);
    
  });
});

module.exports = queryForPartsQuantityQuantityRouter;
