const statusRouter = require("express").Router();
const pool = require("../db");

statusRouter.get("/", (req, res) => {
  var statusTableQuery = "SELECT * FROM statuses;";

  pool.query(statusTableQuery, (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    var results = { rows: result.rows };
    res.json(results.rows);
  });
});

//add status to table
statusRouter.post("/add", (req, res) => {
  var status_id;
  var log_id;
  var status_name;
  var note;
  //insert into status table query
  var addStatusTableQuery = `INSERT into statuses values(${status_id},${log_id},'${status_name}','${note}';`;

  pool.query(addStatusTableQuery, (error, result) => {
    if (error) {
      return;
    }

    res.send(`done`);
  });
});

statusRouter.post("/edit", (req, res) => {
  var status_id;
  var log_id;
  var status_name;
  var note;
  var oldstatus_id;
  var addStatusTableQuery = `UPDATE statuses SET status_id=${status_id},log_id=${log_id},status_name = '${status_name}',note='${note}' WHERE status_id = ${oldstatus_id};`;

  pool.query(addStatusTableQuery, (error, result) => {
    if (error) {
      return;
    }

    res.send(`done`);
  });
});

module.exports = statusRouter;
