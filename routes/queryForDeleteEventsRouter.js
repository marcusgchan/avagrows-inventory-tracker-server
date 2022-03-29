const queryForDeleteEventsRouter = require("express").Router();
const pool = require("../db");

queryForDeleteEventsRouter.get("/", (req, res) => {
  //select all parts from part quantity table
  var queryForDeleteEventsQuery = "SELECT * FROM delete_events;";

  pool.query(queryForDeleteEventsQuery, (error, result) => {
    if (error) {  
      console.log(error);
      res.status(200).end();
      
    }
    var results = result.rows;
    res.json(results);
    
  });
});

module.exports = queryForDeleteEventsRouter;
