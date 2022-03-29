const queryForEventLocationRouter = require("express").Router();
const pool = require("../db");

queryForEventLocationRouter.get("/", (req, res) => {
  //select all events from relocation events table.
  var queryForEventLocationQuery = "SELECT * FROM relocation_events;";

  pool.query(queryForEventLocationQuery, (error, result) => {
    if (error) {  
      console.log(error);
      res.status(200).end();
      
    }
    var results = result.rows;
    res.json(results);
    
  });
});

module.exports = queryForEventLocationRouter;
