const queryForTestTotalQuantityRouter = require("express").Router();
const pool = require("../db");

queryForTestTotalQuantityRouter.get("/", (req, res) => {
  //select all parts from part quantity table
  var queryForTestQuantityQuery = "SELECT * FROM parts where internal_part_number = '2MP04';";

  pool.query(queryForTestQuantityQuery, (error, result) => {
    if (error) {  
      console.log(error);
      res.status(400).end;
      
    }
    var results = result.rows[0].total_quantity;
    res.json(results);
    
  });
});



module.exports = queryForTestTotalQuantityRouter;
