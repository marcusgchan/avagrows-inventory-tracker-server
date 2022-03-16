const changeLocationQuatityRouter = require("express").Router();
const pool = require("../db");
// change location of items
changeLocationQuatityRouter.post("/", async (req, res) => {
  var internal_part_number = req.body.internal_part_number;
  var oldLocation;
  var oldStatus;
  var oldQuantity;
  var newLocation;
  var newStatus;
  var newQuantity;
  var amountToChange;

  try {
      //check if there is quantity available to be moved
    if (oldQuantity - amountToChange < 0) {
      console.log("error, not enough quantity");
      return;
    } else {
        //variables for the ajusted values of old quantity and new quantity respectably
      var newOldQuantity = oldQuantity - amountToChange;
      var newNewQuantity = newquantity + amountToChange;
      var results2;
      var results;
        //query to update the original value
      var changeLocationQuatityTableQuery = `UPDATE part_quantity SET quantity =${newOldQuantity} WHERE internal_part_number = ${internal_part_number} AND status_id = ${oldStatus} AND location_id = ${oldLocation};`;
      //query to update new quantity
      var changeLocationQuatityTableQuery2 = `UPDATE part_quantity SET quantity =${newNewQuantity} WHERE internal_part_number = ${internal_part_number} AND status_id = ${newStatus} AND location_id = ${newLocation};`;
      
      var changeLocationQuatityTableQuery3 = `select * from part_quantity WHERE internal_part_number = ${internal_part_number} AND status_id = ${newStatus} AND location_id = ${newLocation};`;
      var changeLocationQuatityTableQuery4 = `insert into part_quantity values ('${internal_part_number}','${newLocation}','${newStatus}',${amountToChange},' ' );`;

      const result = await pool.query(changeLocationQuatityTableQuery3);
      results2 = result.rows;
        //if entry does not exist create a new one
      if (results2.length == 0) {
        await pool.query(changeLocationQuatityTableQuery4);
        await pool.query(changeLocationQuatityTableQuery);
      } else {
          //else update the two entries
        await pool.query(changeLocationQuatityTableQuery);
        await pool.query(changeLocationQuatityTableQuery2);
      }
    }
  } catch (e) {
    console.log(e);
    return;
  }
});

module.exports = changeLocationQuatityRouter;
