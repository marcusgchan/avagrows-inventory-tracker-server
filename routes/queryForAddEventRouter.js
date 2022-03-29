const queryForAddEventRouter = require("express").Router();
const pool = require("../db");

queryForAddEventRouter.get("/", (req, res) => {
  //select all parts from part quantity table
  var queryForAddEventQuery = "SELECT * FROM add_events;";

  pool.query(queryForAddEventQuery, (error, result) => {
    if (error) {  
      console.log(error);
      res.status(200).end();
      
    }
    var results = result.rows;
    res.json(results);
    
  });
});

module.exports = queryForAddEventRouter;
