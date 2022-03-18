const editStatusRouter = require("express").Router();
const pool = require("../db");
var old_status_id
var new_status_id
var log_id
var status_name
var note


editLocationRouter.post("/", (req, res) => {
  var editStatusTableQuery = `UPDATE statuses SET location_id = ${new_status_id}, log_id = ${log_id}, location_name = '${status_name}', note = '${note}' WHERE location_id = ${old_status_id};`;

  pool.query(editStatusTableQuery, (error, result) => {
    if (error) {
      return;
    }
    res.send(done);
  });
});

module.exports = editStatusRouter;