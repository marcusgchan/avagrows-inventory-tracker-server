const addLocationRouter = require("express").Router();
const pool = require("../db");
var location_id;
var log_id;
var location_name;
var address;
var postal_code;

addLocationRouter.post("/", (req, res) => {
  var addLocationTableQuery = `INSERT into locations values(${location_id},${log_id},'${location_name}','${address}', '${postal_code});`;

  pool.query(addLocationTableQuery, (error, result) => {
    if (error) {
      return;
    }
    res.send(done);
  });
});

module.exports = addLocationRouter;
