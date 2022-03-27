const moveLocationRouter = require("express").Router();
const pool = require("../db");

// change location of items
moveLocationRouter.post("/", async (req, res) => {
  let {
    internal_part_number,
    location_id,
    status_id,
    new_location_id,
    new_status_id,
    old_quantity,
    new_quantity,
  } = req.body;

  // the amount that is moved into the new location would be the amount of parts missing from the previous quantity
  // ex. old quantity was 20. quantity is now 9. 20 - 9 = 11. 11 is the amount that was moved
  let moveAmount = old_quantity - new_quantity;

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
      let updatePrevLocationQuery = `UPDATE part_quantity SET quantity = ${new_quantity} WHERE internal_part_number = '${internal_part_number}' AND status_id = ${status_id} AND location_id = ${location_id};`;

      //query that creates a row for where the parts will be moved into if the row doesn't already exist
      let insertIntoNewLocationQuery = `INSERT into part_quantity values('${internal_part_number}', '${new_location_id}', '${new_status_id}', '${moveAmount}', '', DEFAULT)`;

      if (newLocation.rows.length === 0) {
        // updates the previous location and creates a row for the new location
        await pool.query(insertIntoNewLocationQuery);
        await pool.query(updatePrevLocationQuery);
      } else {
        //updates the new and previous location
        await pool.query(updatePrevLocationQuery);
        await pool.query(updateNewLocationQuery);
      }

      // Generates a log.
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      var hours = today.getHours();
      var minutes = today.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      
      today = mm + '/' + dd + '/' + yyyy + '/' + strTime;
      
      let loggingQuery = `insert into logs values( nextval('logs_log_id_seq'),'${user_id}','${internal_part_number}',3,'${today}','','Relocated Part') returning log_id;`
      let log_id = await pool.query(loggingQuery);
    
      let eventQuery = `insert into relocation_events values(${log_id.rows[0].log_id},3,${moveAmount},${location_id},${new_location_id},${new_status_id},${internal_part_number});`
      await pool.query(eventQuery);

      let rowResults = await pool.query(
        `SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.internal_part_number = part_categories.part_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id;`
      );
      res.status(200).json(rowResults.rows);
    }
  } catch (e) {
    res.status(400).json("Bad request");
  }
});

module.exports = moveLocationRouter;
