const locationRouter = require("express").Router();
const pool = require("../db");

locationRouter.get("/", (req, res) => {
  var locationTableQuery = "SELECT * FROM locations;";

  pool.query(locationTableQuery, (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    var results = { rows: result.rows };
    res.json(results.rows);
  });
});

/*  Deletes a part from the locations table. 
    First checks if there are parts stored at this specific location.
    If there are, this function does not allow the user to delete the location.
    Otherwise, the location is removed. */
locationRouter.post("/delete", async (req, res) => {
  var location_id = req.body.location_id;
  var deleteLocationTableQuery = `DELETE FROM locations WHERE location_id = ${location_id};`;
  var checkIfInUse = `SELECT * FROM part_quantity WHERE location_id = ${location_id};`;
  var results;

  try {
    const result = await pool.query(checkIfInUse);
    results = result.rows;

    if (results.length < 1) {
      await pool.query(deleteLocationTableQuery);
      res.status(200).json("done");
    } else {
      console.log("This location is still in use!");
    }
  } catch (e) {
    console.log(e);
    return;
  }
});

/*  Edits an entry in the locations table with the updated information provided by the user.  */
locationRouter.post("/edit", (req, res) => {
  let {
    old_location_id,
    new_location_id,
    log_id,
    location_name,
    address,
    postal_code,
  } = req.body;

  var editLocationTableQuery = `UPDATE locations SET location_id = ${new_location_id}, log_id = ${log_id}, location_name = '${location_name}', address = '${address}', postal_code = '${postal_code}' WHERE location_id = ${old_location_id};`;

  pool.query(editLocationTableQuery, (error, result) => {
    if (error) {
      res.status(400).json("error");
    }
    res.status(200).json("done");
  });
});

// add to location table
locationRouter.post("/add", (req, res) => {
  var { location_id, log_id, location_name, address, postal_code } = req.body;
  var addLocationTableQuery = `INSERT into locations values(${location_id},${log_id},'${location_name}','${address}', '${postal_code}');`;
  //query to add location into database
  pool.query(addLocationTableQuery, (error, result) => {
    if (error) {
      return;
    }
    res.status(400).json("done");
  });
});

module.exports = locationRouter;
