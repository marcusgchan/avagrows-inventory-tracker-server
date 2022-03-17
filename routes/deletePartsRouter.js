const deletePartsRouter = require("express").Router();
const pool = require("../db");

/*  Deletes a part from the part_quantity table. 
    First checks if the internal part number is in the main parts table,
    throws an error if a match is found,
    otherwise deletes all entries with that part number. */

var internal_part_number;
var partsQuantityRows;
deletePartsRouter.post("/", async (req, res) => {
  try {
    var partsQuantityQuery = `SELECT * FROM part_quantity WHERE internal_part_id = ${internal_part_id};`;
    const result = await pool.query(partsQuantityQuery);
    partsQuantityRows = result.rows;
    if (partsQuantityRows.length > 0) return;

    var addStatusTableQuery = `DELETE FROM Parts WHERE internal_part_number = ${internal_part_number};`;

    await pool.query(addStatusTableQuery);
  } catch (e) {
    console.log(e);
    return;
  }
});

module.exports = deletePartsRouter;
