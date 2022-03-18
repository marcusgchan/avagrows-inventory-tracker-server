const deleteLocationRouter = require("express").Router();
const pool = require("../db");

/*  Deletes a part from the locations table. 
    First checks if there are parts stored at this specific location.
    If there are, this function does not allow the user to delete the location.
    Otherwise, the location is removed. */

var location_id;

deleteLocationRouter.post("/", async (req, res) => {
  var deleteLocationTableQuery = `DELETE FROM locations WHERE location_id = ${location_id};`;
  var checkIfInUse = `SELECT * FROM part_quantity WHERE location_id = ${location_id};`;
  var results;

  try {
    const result = await pool.query(checkIfInUse);
    results = result.rows;

    if (results.length < 1) {
      await pool.query(deleteLocationTableQuery);
    } else {
      console.log("This location is still in use!");
    }
  } catch (e) {
    console.log(e);
    return;
  }
});

module.exports = deleteLocationRouter;
