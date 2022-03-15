const editStatusRouter = require("express").Router();
const pool = require("../db");

var status_id;
var log_id;
var status_name;
var note;
var oldstatus_id;
editStatusRouter.post("/", (req, res) => {
  var addStatusTableQuery = `UPDATE statuses SET status_id=${status_id},log_id=${log_id},status_name = '${status_name}',note='${note}' WHERE status_id = ${oldstatus_id};`;

  pool.query(addStatusTableQuery, (error, result) => {
    if (error) {
      return;
    }

    res.send(`done`);
  });
});

module.exports = editStatusRouter;
