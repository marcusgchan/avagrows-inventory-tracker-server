const changeQuantityRouter = require("express").Router();
const pool = require("../db");
// change quantity of part
changeQuantityRouter.post("/", async (req, res) => {
  var old_quantity; /* place old quantity in a hidden input for access */
  var new_quantity; /* = req.body */
  var total_quantity; /* = req.body */
  var internal_part_number; /* = req.body */
  var location_id; /* = req.body */
  var status_id; /* = req.body */
  //query to update part to new value
  var changeQuantityTableQuery = `UPDATE part_quantity SET quantity = ${new_quantity} WHERE internal_part_number =${internal_part_number} AND location_id =${location_id} AND status_id =${status_id};`;
  //query to update parts table
  var changeTotalQuantityTableQuery = `UPDATE parts SET total_quantity = ${total_quantity + new_quantity - old_quantity} WHERE internal_part_number =${internal_part_number};`;
  //check parts table for an entry
  var checkForEntry = `SELECT * FROM parts WHERE internal_part_number = ${internal_part_number};`;

  try {
      //change quantity to new value
    await pool.query(changeQuantityTableQuery);
    // check for entry in parts table
    const result = await pool.query(checkForEntry);
    total_quantity = result.rows[0].total_quantity;
    // update total quantity in parts table
    await pool.query(changeTotalQuantityTableQuery);
  } catch (e) {
    console.log(e);
    return;
  }
});

module.exports = changeQuantityRouter;
