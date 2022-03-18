const deletePartRouter = require("express").Router();
const pool = require("../db");

/*  What does this function do exactly? I am not sure. */

deletePartRouter.post("/", async (req, res) => {
  const { internal_part_number, location_id, status_id } = req.body;

  var deleteFromAllTables = `DELETE FROM part_quantity WHERE internal_part_number = '${internal_part_number}' AND location_id = '${location_id}' AND status_id = '${status_id}'`;
  var partsQuantityQuery = `SELECT * FROM part_quantity WHERE internal_part_number = '${internal_part_number}' AND status_id = '${status_id}' AND location_id = '${location_id}'`;
  var checkForEntry = `SELECT * FROM parts WHERE internal_part_number = '${internal_part_number}'`;
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
    var addNewPartTotalQuantity = `UPDATE parts SET total_quantity = '${totalQuantity}' WHERE internal_part_number = '${internal_part_number}'`;
    await pool.query(addNewPartTotalQuantity);

    res.status(200).end();
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: "Bad request" });
  }
});

module.exports = deletePartRouter;
