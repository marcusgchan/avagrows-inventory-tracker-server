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

/*  Deletes a status from the statuses table.
    First checks if the status is attached to any entry in the part quantity table,
    if a part entry is using the status, then it does not go through.
    Otherwise, the status is deleted from the table.    */
statusRouter.post("/delete", async (req, res) => {
  var partsQuantityRows;

  var status_id = req.body.status_id;
  try {
    var partsQuantityQuery = `SELECT * FROM part_quantity WHERE status_id = ${status_id};`;
    const result = await pool.query(partsQuantityQuery);
    partsQuantityRows = result.rows;
    if (partsQuantityRows.length > 0) res.status(400).end();

    var addStatusTableQuery = `DELETE FROM statuses WHERE status_id = ${status_id};`;

    await pool.query(addStatusTableQuery);
    res.status(200).end();
  } catch (e) {
    console.log(e);
    res.status(400).json("error");
  }
});

module.exports = statusRouter;
