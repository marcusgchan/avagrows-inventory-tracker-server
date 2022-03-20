const editLocationRouter = require("express").Router();
const pool = require("../db");

/*  Edits an entry in the locations table with the updated information provided by the user.  */

editLocationRouter.post("/", (req, res) => {
  
let{
old_location_id,
 new_location_id,
 log_id,
 location_name,
 address,
 postal_code,
}=req.body

  var editLocationTableQuery = `UPDATE locations SET location_id = ${new_location_id}, log_id = ${log_id}, location_name = '${location_name}', address = '${address}', postal_code = '${postal_code}' WHERE location_id = ${old_location_id};`;

  pool.query(editLocationTableQuery, (error, result) => {
    if (error) {
      res.status(400).json("error")
    }
    res.status(200).json("done");
  });
});

module.exports = editLocationRouter;