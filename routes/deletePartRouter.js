const deletePartRouter = require("express").Router();
const pool = require("../db");

/*  What does this function do exactly? I am not sure. */

deletePartRouter.post("/", async (req, res) => {
  const { internal_part_number, location_id, status_id, user_id } = req.body;

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
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;

    today = mm + '/' + dd + '/' + yyyy + '/' + strTime;

    let loggingQuery = `insert into logs values( nextval('logs_log_id_seq'),'${user_id}','${internal_part_number}',5,'${today}','','Deleted Part') returning log_id;`
    let log_id = await pool.query(loggingQuery);

    let eventQuery = `insert into delete_events values(${log_id.rows[0].log_id},5,'${internal_part_number}',${quantity});`
    await pool.query(eventQuery);

    let rowResults = await pool.query(
      `SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.internal_part_number = part_categories.part_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id;`
    );
    res.status(200).json(rowResults.rows);
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: "Bad request" });
  }
});

module.exports = deletePartRouter;
