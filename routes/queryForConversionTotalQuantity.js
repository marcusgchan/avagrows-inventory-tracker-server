const queryForConversionTotalQuantity = require("express").Router();
const pool = require("../db");

queryForConversionTotalQuantity.get("/", (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuery = "SELECT * FROM parts where internal_part_number = 'BYTE' or internal_part_number = 'LIGHTSTAND' or internal_part_number = 'PUMPHOUSING' or internal_part_number = 'WATERTANK' or internal_part_number = 'PACKAGING' ;";

  pool.query(queryPartsQuery, (error, result) => {
    if (error) {  
      console.log(error);
      res.status(400).end();
      
    }
    var results = result.rows;
    res.status(200).json(results);
    
  });
});

module.exports = queryForConversionTotalQuantity;
