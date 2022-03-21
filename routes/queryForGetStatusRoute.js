const queryForGetStatusRoute = require("express").Router();
const pool = require("../db");

queryForGetStatusRoute.get("/", (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuery = "SELECT * FROM statuses";

  pool.query(queryPartsQuery, (error, result) => {
    if (error) {  
      console.log(error);
      res.status(200).end();
      
    }
    var results = result.rows;
    res.json(results);
    
  });
});

module.exports = queryForGetStatusRoute;
