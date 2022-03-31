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
      var returnQuery = `SELECT * from locations;`
            var resultRet = await pool.query(returnQuery)

            let resultsRet = { rows: resultRet.rows, canDelete: true };
            return res.status(200).json(resultsRet);
    } else {
      var returnQuery = `SELECT * from locations;`
            var resultRet = await pool.query(returnQuery)
  
            let resultsRet = { rows: resultRet.rows, canDelete: false };
            return res.status(200).json(resultsRet);
    }
  } catch (e) {
    return res.status(400).json(e);
    
  }
});

/*  Edits an entry in the locations table with the updated information provided by the user.  */
locationRouter.post("/edit", async(req, res) => {
  let {
    location_id,
    location_name,
    address,
    postal_code,
  } = req.body;
  try{
  var isDuplicateQuery=`select * from locations where location_name = '${location_name}';`
  
  var result = await pool.query(isDuplicateQuery)

  if (result.rows.length >= 1) {
      var returnQuery = `SELECT * from locations;`
      var resultRet = await pool.query(returnQuery)

      let resultsRet = { rows: resultRet.rows, canEdit: false };
      return res.status(200).json(resultsRet);


  }
  var editLocationTableQuery = `UPDATE locations SET  location_name = '${location_name}', address = '${address}', postal_code = '${postal_code}' WHERE location_id = ${location_id};`;

  await pool.query(editLocationTableQuery)

  var returnQuery = `SELECT * from locations;`
            var resultRet = await pool.query(returnQuery)

            let resultsRet = { rows: resultRet.rows, canEdit: true };
            return res.status(200).json(resultsRet);

}catch(e){
  return res.status(400).json(e);
}
});

// add to location table
locationRouter.post("/add", async (req, res) => {
  var {  location_name, address, postal_code } = req.body;
  try{
  var addLocationTableQuery = `INSERT into locations values(DEFAULT,'${location_name}','${address}', '${postal_code}');`;
  var isDuplicateQuery=`select * from locations where location_name = '${location_name}';`
  
  var result = await pool.query(isDuplicateQuery)

  if (result.rows.length >= 1) {
      var returnQuery = `SELECT * from locations;`
      var resultRet = await pool.query(returnQuery)

      let resultsRet = { rows: resultRet.rows, canAdd: false };
      return res.status(200).json(resultsRet);


  }

  //query to add location into database
  await pool.query(addLocationTableQuery);
  var returnQuery = `SELECT * from locations;`
            var resultRet = await pool.query(returnQuery)

            let resultsRet = { rows: resultRet.rows, canAdd: true };
            return res.status(200).json(resultsRet);

}catch(e){
  return res.status(400).json(e);
}
});

module.exports = locationRouter;
