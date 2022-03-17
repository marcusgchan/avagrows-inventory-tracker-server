const changeQuantityRouter = require("express").Router();
const pool = require("../db");
// change quantity of part
changeQuantityRouter.post("/", async (req, res) => {
  let {
    old_quantity,
    quantity,
    total_quantity,
    internal_part_number,
    location_id,
    status_id,
  } = req.body;

  //query to update part to new value
  var changeQuantityTableQuery = `UPDATE part_quantity SET quantity = ${quantity} WHERE internal_part_number ='${internal_part_number}' AND location_id =${location_id} AND status_id =${status_id};`;
  //query to update parts table
  var changeTotalQuantityTableQuery = `UPDATE parts SET total_quantity = ${
    total_quantity + quantity - old_quantity
  } WHERE internal_part_number ='${internal_part_number}';`;
  //check parts table for an entry
  var checkForEntry = `SELECT * FROM parts WHERE internal_part_number = '${internal_part_number}';`;

  try {
    //change quantity to new value
    await pool.query(changeQuantityTableQuery);

    // check for entry in parts table
    const result = await pool.query(checkForEntry);
    total_quantity = result.rows[0].total_quantity;

    // update total quantity in parts table
    await pool.query(changeTotalQuantityTableQuery);
    res.status(200).end();
  } catch (e) {
    res.status(400).end();
    return;
  }
});

module.exports = changeQuantityRouter;
