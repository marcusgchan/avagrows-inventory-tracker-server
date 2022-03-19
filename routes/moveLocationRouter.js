const changeLocationQuantityRouter = require("express").Router();
const pool = require("../db");

// change location of items
changeLocationQuantityRouter.post("/", async (req, res) => {
  let {
    internal_part_number,
    quantity,
    location_id,
    status_id,
    new_location_id,
    new_status_id,
    old_quantity,
  } = req.body;

  // the amount that is moved into the new location would be the amount of parts missing from
  // the previous quantity
  let moveAmount = old_quantity - quantity;

  try {
    //check if there is quantity available to be moved
    if (old_quantity - moveAmount < 0) {
      res
        .status(400)
        .json({ msg: "Trying to move more of an item than there actually is" });
    } else {
      // query that grabs the new location the items will be moved to
      let getNewLocationQuery = `SELECT * from part_quantity WHERE internal_part_number = '${internal_part_number}' AND status_id = ${new_status_id} AND location_id = ${new_location_id};`;

      const newLocation = await pool.query(getNewLocationQuery);
      let updateNewLocationQuery;

      // gets the updated quantity of the new location after moving items there
      if (newLocation.rows.length !== 0) {
        let newLocationQty = newLocation.rows[0].quantity + moveAmount;

        //query updates quantity of the part row with the new location and status
        updateNewLocationQuery = `UPDATE part_quantity SET quantity = ${newLocationQty} WHERE internal_part_number = '${internal_part_number}' AND status_id = ${new_status_id} AND location_id = ${new_location_id};`;
      }

      //query that updates quantity of the part row with the previous location and status
      let updatePrevLocationQuery = `UPDATE part_quantity SET quantity = ${quantity} WHERE internal_part_number = '${internal_part_number}' AND status_id = ${status_id} AND location_id = ${location_id};`;

      //query that creates a row for where the parts will be moved into if the row doesn't already exist
      let insertIntoNewLocationQuery = `INSERT into part_quantity values('${internal_part_number}', '${new_location_id}', '${new_status_id}', '${moveAmount}', '', DEFAULT)`;

      if (newLocation.rows.length === 0) {
        // updates the previous location and creates a row for the new location
        await pool.query(insertIntoNewLocationQuery);
        await pool.query(updatePrevLocationQuery);
        res.status(200).json("done");
      } else {
        //updates the new and previous location
        await pool.query(updatePrevLocationQuery);
        await pool.query(updateNewLocationQuery);
        res.status(200).json("done");
      } 
    }
  } catch (e) {
    res.status(400).json("Bad request");
  }
});

module.exports = changeLocationQuantityRouter;
