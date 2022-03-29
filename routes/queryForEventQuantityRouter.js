const queryForEventQuantityRouter = require("express").Router();
const pool = require("../db");

queryForEventQuantityRouter.get("/", (req, res) => {
  //select all events from relocation events table.
  var queryForEventQuantityQuery = "SELECT * FROM quantity_change_events;";

  pool.query(queryForEventQuantityQuery, (error, result) => {
    if (error) {  
      console.log(error);
      res.status(200).end();
      
    }
    var results = result.rows;
    res.json(results);
    
  });
});

module.exports = queryForEventQuantityRouter;
