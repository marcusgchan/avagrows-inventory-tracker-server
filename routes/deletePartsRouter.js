const deletePartsRouter = require("express").Router();
const pool = require("../db");

var sinternal_part_number;
var partsQuantityRows
deletePartsRouter.post("/", (req, res) => {
    var partsQuantityQuery = `SELECT * FROM part_quantity WHERE internal_part_id = ${internal_part_id};`;
    pool.query(partsQuantityQuery,(error,result)=>{
        if(error){
            return;
        }
        partsQuantityRows=result.rows;

    })
    if(partsQuantityRows.length>0)
        return
    
  var addStatusTableQuery =
    `DELETE FROM Parts WHERE internal_part_number = ${internal_part_number};`;

  pool.query(addStatusTableQuery, (error, result) => {
    if (error) {
      
      return;
    }
    
    res.send(`done`);
  });
});

module.exports = deleteStatusRouter;