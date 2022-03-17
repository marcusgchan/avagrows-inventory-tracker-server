const addPartQuantityRouter = require("express").Router();
const pool = require("../db");

//add part to part quantity table
addPartQuantityRouter.post("/", async (req, res) => {
  let {
    internal_part_number,
    location_id,
    status_id,
    quantity,
    note,
    total_quantity,
  } = req.body;

  //query to insert into parts quantity table
  let addNewPartQuantity = `INSERT INTO part_quantity values('${internal_part_number}', '${location_id}', '${status_id}', '${quantity}', '${note}', DEFAULT);`;
  //query to check for dublicates in table
  let checkForDuplicates = `SELECT * FROM part_quantity WHERE internal_part_number = '${internal_part_number}' AND status_id = ${status_id} AND location_id = ${location_id};`;
  //query to check parts table for entry
  let checkForEntry = `SELECT * FROM parts WHERE internal_part_number = '${internal_part_number}';`;

  try {
    //first check the parts table for entry
    const result = await pool.query(checkForEntry);
    let resultsForEntry = result.rows;

    //if no entry, then we want to cancel the operation
    if (resultsForEntry.length < 1) {
      res.status(400).json("No such internal part number exists");
    }
    //if an entry exists then check to see it is not already in the part quantity table
    const result2 = await pool.query(checkForDuplicates);
    let results = result2.rows;

    //if no entry create a new entry and update total quantity
    if (results.length == 0) {
      await pool.query(addNewPartQuantity);

      let updatedQuantity = total_quantity + Number(quantity);
      //update the total quantity in the parts table
      let addNewPartTotalQuantity = `UPDATE parts SET total_quantity = '${updatedQuantity}' WHERE internal_part_number = '${internal_part_number}'`;
      await pool.query(addNewPartTotalQuantity);

      res.status(200).end();
    } else {
      //if part is already in table then return
      res
        .status(400)
        .json("This part already exists at this location with this status!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
});

module.exports = addPartQuantityRouter;
