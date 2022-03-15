const deleteLocationRouter = require("express").Router();
const pool = require("../db");
var location_id;

deleteLocationRouter.post("/", async (req, res) => {
  var deleteLocationTableQuery = `DELETE FROM locations WHERE location_id = ${location_id};`;
  var checkIfInUse = `SELECT * FROM part_quantity WHERE location_id = ${location_id};`;
  var results;

  try {
    const result = pool.query(checkIfInUse);
    results = result.rows;

    if (results.length < 1) {
      pool.query(deleteLocationTableQuery);
    } else {
      console.log("This location is still in use!");
    }
  } catch (e) {
    console.log(e);
    return;
  }
});

module.exports = deleteLocationRouter;
