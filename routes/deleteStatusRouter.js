const deleteStatusRouter = require("express").Router();
const pool = require("../db");

var status_id;
var partsQuantityRows
deleteStatusRouter.post("/", (req, res) => {
    var partsQuantityQuery = `SELECT * FROM part_quantity WHERE status_id = ${status_id};`;
    pool.query(partsQuantityQuery,(error,result)=>{
        if(error){
            return;
        }
        partsQuantityRows=result.rows;

    })
    if(partsQuantityRows.length>0)
        return
    
  var addStatusTableQuery =
    `DELETE FROM statuses WHERE status_id = ${status_id};`;

  pool.query(addStatusTableQuery, (error, result) => {
    if (error) {
      
      return;
    }
    
    res.send(`done`);
  });
});

module.exports = deleteStatusRouter;