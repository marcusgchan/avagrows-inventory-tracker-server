const deletePartRouter = require("express").Router();
const pool = require("../db");

deletePartRouter.post("/", async (req, res) => {
  var internal_part_number; /* = req.body */
  var location_id;
  var status_id;
  var deleteFromAllTables = ` DELETE FROM part_quantity WHERE internal_part_number = ${internal_part_number}, location_id = ${location_id}, status_id = ${status_id};`;
  var partsQuantityQuery = `SELECT * FROM part_quantity WHERE internal_part_number = ${internal_part_number}, status_id = ${status_id}, location_id = ${location_id};`;
  var checkForEntry = `SELECT * FROM parts WHERE internal_part_number = ${internal_part_number};`;
  var resultsForTotalQuantity;
  var quantity;
  var totalQuantity;
  try {
    const result = await pool.query(partsQuantityQuery);

    quantity = result.rows[0].quantity;

    await pool.query(deleteFromAllTables);

    const result2 = await pool.query(checkForEntry);
    resultsForTotalQuantity = result2.rows[0].total_quantity;

    totalQuantity = resultsForTotalQuantity - quantity;
    var addNewPartTotalQuantity = `UPDATE parts SET total_quantity = ${totalQuantity} WHERE internal_part_number = ${internal_part_number}`;
    await pool.query(addNewPartTotalQuantity);
  } catch (e) {
    console.log(e);
    return;
  }
});

module.exports = deletePartRouter;
