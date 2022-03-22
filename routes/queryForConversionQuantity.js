const queryForConversionQuantity = require("express").Router();
const pool = require("../db");

queryForConversionQuantity.get("/", (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuery = "SELECT * FROM part_quantity where internal_part_number = 'BYTE'and location_id = 2 and status_id=2 or internal_part_number = 'LIGHTSTAND'and location_id = 2 and status_id=2 or internal_part_number = 'PUMPHOUSING' and location_id = 2 and status_id=2 or internal_part_number = 'WATERTANK' and location_id = 2 and status_id=2 or internal_part_number = 'PACKAGING' and location_id = 2 and status_id=2;";

  pool.query(queryPartsQuery, (error, result) => {
    if (error) {  
      console.log(error);
      res.status(200).end();
      
    }
    var results = result.rows;
    res.json(results);
    
  });
});

module.exports = queryForConversionQuantity;
