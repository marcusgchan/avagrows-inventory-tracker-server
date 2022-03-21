const deleteStatusRouter = require("express").Router();
const pool = require("../db");

/*  Deletes a status from the statuses table.
    First checks if the status is attached to any entry in the part quantity table,
    if a part entry is using the status, then it does not go through.
    Otherwise, the status is deleted from the table.    */


var partsQuantityRows;
deleteStatusRouter.post("/", async (req, res) => {
    var status_id=req.body.status_id;
  try {
    var partsQuantityQuery = `SELECT * FROM part_quantity WHERE status_id = ${status_id};`;
    const result = await pool.query(partsQuantityQuery);
    partsQuantityRows = result.rows;
    if (partsQuantityRows.length > 0) 
    res.status(400).end();

    var addStatusTableQuery = `DELETE FROM statuses WHERE status_id = ${status_id};`;

    await pool.query(addStatusTableQuery);
    res.status(200).end();
  } catch (e) {
    console.log(e);
    res.status(400).json("error");
  }
});

module.exports = deleteStatusRouter;
