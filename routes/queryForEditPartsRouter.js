const queryForEditPartsRouter = require("express").Router();
const pool = require("../db");

queryForEditPartsRouter.get("/", (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuery = "SELECT * FROM parts where internal_part_number = 'test'";

  pool.query(queryPartsQuery, (error, result) => {
    if (error) {  
      console.log(error);
      res.status(200).end();
      
    }
    var results = result.rows;
    res.json(results);
    
  });
});

module.exports = queryForEditPartsRouter;