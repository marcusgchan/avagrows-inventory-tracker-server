const addStatusRouter = require("express").Router();
const pool = require("../db");
var status_id;
var log_id;
var status_name;
var note;
//add status to table
addStatusRouter.post("/", (req, res) => {
    //insert into status table query
  var addStatusTableQuery = `INSERT into statuses values(${status_id},${log_id},'${status_name}','${note}';`;

  pool.query(addStatusTableQuery, (error, result) => {
    if (error) {
      return;
    }

    res.send(`done`);
  });
});

module.exports = addStatusRouter;
