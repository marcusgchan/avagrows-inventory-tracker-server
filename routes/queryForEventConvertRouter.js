const queryForEventConvertRouter = require("express").Router();
const pool = require("../db");

queryForEventConvertRouter.get("/", (req, res) => {
  //select all parts from part quantity table
  var queryForEventConvertQuery = "SELECT * FROM convert_events;";

  pool.query(queryForEventConvertQuery, (error, result) => {
    if (error) {  
      console.log(error);
      res.status(200).end();
      
    }
    var results = result.rows;
    res.json(results);
    
  });
});

module.exports = queryForEventConvertRouter;
