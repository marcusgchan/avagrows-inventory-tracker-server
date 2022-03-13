const editLocationRouter = require("express").Router();
const pool = require("../db");
var old_location_id
var new_location_id
var log_id
var location_name
var address
var postal_code

editLocationRouter.post("/", (req, res) => {
  var editLocationTableQuery = `UPDATE locations SET location_id = ${new_location_id}, log_id = ${log_id}, location_name = '${location_name}', address = '${address}', postal_code = '${postal_code}' WHERE location_id = ${old_location_id};`;

  pool.query(editLocationTableQuery, (error, result) => {
    if (error) {
      return;
    }
    res.send(done);
  });
});

module.exports = editLocationRouter;