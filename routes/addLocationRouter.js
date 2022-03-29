const addLocationRouter = require("express").Router();
const req = require("express/lib/request");
const pool = require("../db");

//add to location table
addLocationRouter.post("/", (req, res) => {
  var {
    location_id,
    log_id,
    location_name,
    address,
    postal_code,
  } = req.body
  var addLocationTableQuery = `INSERT into locations values(${location_id},${log_id},'${location_name}','${address}', '${postal_code}');`;
  //query to add location into database
  pool.query(addLocationTableQuery, (error, result) => {
    if (error) {
      return;
    }
    res.status(400).json("done");
  });
});

module.exports = addLocationRouter;
