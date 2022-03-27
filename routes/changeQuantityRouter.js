const changeQuantityRouter = require("express").Router();
const pool = require("../db");
// change quantity of part
changeQuantityRouter.post("/", async (req, res) => {
  let {
    old_quantity,
    new_quantity,
    total_quantity,
    internal_part_number,
    location_id,
    status_id,
  } = req.body;

  //query to update part to new value
  var changeQuantityTableQuery = `UPDATE part_quantity SET quantity = ${new_quantity} WHERE internal_part_number ='${internal_part_number}' AND location_id =${location_id} AND status_id =${status_id};`;
  //query to update parts table
  var changeTotalQuantityTableQuery = `UPDATE parts SET total_quantity = ${
    total_quantity + new_quantity - old_quantity
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
    
    let loggingQuery = `insert into logs values( nextval('logs_log_id_seq'),'${user_id}','${internal_part_number}',1,'${today}','','Deleted Part') returning log_id;`
    let log_id = await pool.query(loggingQuery);
  
    let eventQuery = `insert into quantity_change_events values(${log_id.rows[0].log_id},1,${new_quantity - old_quantity});`
    await pool.query(eventQuery);

    let rowResults = await pool.query(
      `SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.internal_part_number = part_categories.part_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id;`
    );
    res.status(200).json(rowResults.rows);
  } catch (e) {
    res.status(400).end();
    return;
  }
});

module.exports = changeQuantityRouter;
