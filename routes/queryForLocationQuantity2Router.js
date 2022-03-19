const queryForLocationQuantity2Router = require("express").Router();
const pool = require("../db");

queryForLocationQuantity2Router.get("/", (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuantityQuery = "SELECT * FROM part_quantity where internal_part_number='LIGHTSTAND' and location_id = 2 and status_id=1;";

  pool.query(queryPartsQuantityQuery, (error, result) => {
    if (error) {  
      console.log(error);
      res.status(200).end();
      
    }
    var results = result.rows[0].quantity;
    res.json(results);
    
  });
});

module.exports = queryForLocationQuantity2Router;
