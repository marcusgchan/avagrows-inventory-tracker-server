const editStatusRouter = require("express").Router();
const req = require("express/lib/request");
const pool = require("../db");


editStatusRouter.post("/", (req, res) => {
  /*  Edits an entry in the statuses table with the updated information provided by the user.  */
let{ 
    status_id,
 log_id,
 status_name,
 note,
 oldstatus_id,
}=req.body

  var editStatusTableQuery = `UPDATE statuses SET status_id=${status_id},log_id=${log_id},status_name = '${status_name}',note='${note}' WHERE status_id = ${oldstatus_id};`;

  pool.query(editStatusTableQuery, (error, result) => {
    if (error) {
      res.status(400).json("error")
    }
    res.status(200).json("done");
  });
});

module.exports = editStatusRouter;
