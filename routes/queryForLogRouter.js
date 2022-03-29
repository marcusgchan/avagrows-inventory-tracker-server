const queryForLogRouter = require("express").Router();
const pool = require("../db");

queryForLogRouter.get("/", (req, res) => {
  //select all parts from part quantity table
  var queryForLogQuery = "SELECT * FROM logs;";

  pool.query(queryForLogQuery, (error, result) => {
    if (error) {  
      console.log(error);
      res.status(200).end();
      
    }
    var results = result.rows;
    res.json(results);
    
  });
});

module.exports = queryForLogRouter;
