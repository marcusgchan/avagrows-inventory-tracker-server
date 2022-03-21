const queryForEditStatusRouter = require("express").Router();
const pool = require("../db");

queryForEditStatusRouter.get("/", (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuery = "SELECT * from statuses  where status_id = 10";

  pool.query(queryPartsQuery, (error, result) => {
    if (error) {  
      console.log(error);
      res.status(200).end();
      
    }
    var results = result.rows;
    res.json(results);
    
  });
});

module.exports = queryForEditStatusRouter;