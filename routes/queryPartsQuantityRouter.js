const queryPartsQuantityRouter = require("express").Router();
const pool = require("../db");

queryPartsQuantityRouter.get("/", (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuantityQuery = "SELECT * FROM part_quantity;";

  pool.query(queryPartsQuantityQuery, (error, result) => {
    if (error) {  
      console.log(error);
      res.status(200).end
      
    }
    
    res.send({results:500});
  });
});

module.exports = queryPartsQuantityRouter;
