const addPartQuantityRouter = require("express").Router();
const pool = require("../db");
//add part to part quantity table
addPartQuantityRouter.post("/", async (req, res) => {
  var internal_part_number = req.body.internal_part_number;
  var location_id = req.body.location_id;
  var status_id = req.body.status_id;
  var quantity = req.body.quantity;
  var note = req.body.note;
  var results;
  var resultsForEntry;
  var resultsForTotalQuantity;
  var totalQuantity;
  //query to insert into parts quantity table
  var addNewPartQuantity = `INSERT INTO part_quantity values('${internal_part_number}', ${location_id}, ${status_id}, ${quantity}, '${note}';`;
 //query to check for dublicates in table
  var checkForDuplicates = `SELECT * FROM part_quantity WHERE internal_part_number = ${internal_part_number} AND status_id = ${status_id} AND location_id = ${location_id};`;
  //query to check parts table for entry
  var checkForEntry = `SELECT * FROM parts WHERE internal_part_number = ${internal_part_number};`;

  try {
      //first check the parts table for entry
    const result = await pool.query(checkForEntry);
    resultsForEntry = result.rows;
    resultsForTotalQuantity = result.rows[0].total_quantity;

    //if no entry, then we want to cancel the operation
    if (resultsForEntry.length < 1) {
      return;
    }
    //if an entry exists then check to see it is not already in the part quantity table
    const result2 = await pool.query(checkForDuplicates);

    results = result2.rows;
    
    //if no entry create a new entry and update total quantity
    if (results.length == 0) {
      await pool.query(addNewPartQuantity);

      totalQuantity = resultsForTotalQuantity + quantity;
      //update the total quantity in the parts table
      var addNewPartTotalQuantity = `UPDATE parts SET total_quantity =${totalQuantity} WHERE internal_part_number = ${internal_part_number}`;
      await pool.query(addNewPartTotalQuantity);
    } else { //if part is already in table then return
      console.log(
        "This part already exists at this location with this status!"
      );
    }
  } catch (e) {
    console.log(e);
    return;
  }
});

module.exports = addPartQuantityRouter;
