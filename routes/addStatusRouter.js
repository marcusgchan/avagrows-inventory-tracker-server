const addStatusRouter = require("express").Router();
const req = require("express/lib/request");
const pool = require("../db");


//add to status table
addStatusRouter.post("/", (req, res) => {
    let{
 status_id,
 log_id,
 status_name,
 note,
}=req.body
  var addStatusTableQuery = `INSERT into statuses values(${status_id},${log_id},'${status_name}','${note}');`;
  //query to add status into database
  pool.query(addStatusTableQuery, (error, result) => { 
    if (error) {
      res.status(200).end();
    }
    res.status(400).end();
  });
});

module.exports = addStatusRouter;