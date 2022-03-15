const deleteStatusRouter = require("express").Router();
const pool = require("../db");

var status_id;
var partsQuantityRows;
deleteStatusRouter.post("/", async (req, res) => {
  try {
    var partsQuantityQuery = `SELECT * FROM part_quantity WHERE status_id = ${status_id};`;
    const result = await pool.query(partsQuantityQuery);
    partsQuantityRows = result.rows;
    if (partsQuantityRows.length > 0) return;

    var addStatusTableQuery = `DELETE FROM statuses WHERE status_id = ${status_id};`;

    await pool.query(addStatusTableQuery);
  } catch (e) {
    console.log(e);
    return;
  }
});

module.exports = deleteStatusRouter;
