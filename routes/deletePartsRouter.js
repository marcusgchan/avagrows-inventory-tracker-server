const deletePartsRouter = require("express").Router();
const pool = require("../db");

/*  Deletes a part from the part_quantity table. 
    First checks if the internal part number is in the main parts table,
    throws an error if a match is found,
    otherwise deletes all entries with that part number. */

var partsQuantityRows;
deletePartsRouter.post("/", async (req, res) => {
  var internal_part_number = req.body.internal_part_number;
  try {
    var partsQuantityQuery = `SELECT * FROM part_quantity WHERE internal_part_number = '${internal_part_number}';`;
    const result = await pool.query(partsQuantityQuery);
    partsQuantityRows = result.rows;
    if (partsQuantityRows.length > 0) {
      res.status(400).json("error");
    }

    var addStatusTableQuery = `DELETE FROM parts WHERE internal_part_number = '${internal_part_number}';`;

    await pool.query(addStatusTableQuery);

    let rowResults = await pool.query(
      `SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.internal_part_number = part_categories.part_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id;`
    );
    res.status(200).json(rowResults.rows);
  } catch (e) {
    res.status(400).json(e);
  }
});

module.exports = deletePartsRouter;
