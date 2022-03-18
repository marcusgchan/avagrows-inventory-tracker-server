const editStatusRouter = require("express").Router();
const pool = require("../db");

var status_id;
var log_id;
var status_name;
var note;
var oldstatus_id;
editStatusRouter.post("/", (req, res) => {
  /*  Edits an entry in the statuses table with the updated information provided by the user.  */

  var editStatusTableQuery = `UPDATE statuses SET status_id=${status_id},log_id=${log_id},status_name = '${status_name}',note='${note}' WHERE status_id = ${oldstatus_id};`;

  pool.query(editStatusTableQuery, (error, result) => {
    if (error) {
      return;
    }
    res.send(done);
  });
});

module.exports = editStatusRouter;
