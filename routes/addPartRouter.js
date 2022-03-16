const addPartQuantityRouter = require("express").Router();
const pool = require("../db");

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
  var addNewPartQuantity = `INSERT INTO part_quantity values('${internal_part_number}', ${location_id}, ${status_id}, ${quantity}, '${note}';`;
  var checkForDuplicates = `SELECT * FROM part_quantity WHERE internal_part_number = ${internal_part_number} AND status_id = ${status_id} AND location_id = ${location_id};`;
  var checkForEntry = `SELECT * FROM parts WHERE internal_part_number = ${internal_part_number};`;

  try {
    const result = await pool.query(checkForEntry);
    resultsForEntry = result.rows;
    resultsForTotalQuantity = result.rows[0].total_quantity;

    if (resultsForEntry.length < 1) {
      return;
    }

    const result2 = await pool.query(checkForDuplicates);

    results = result2.rows;

    if (results.length == 0) {
      await pool.query(addNewPartQuantity);

      totalQuantity = resultsForTotalQuantity + quantity;
      var addNewPartTotalQuantity = `UPDATE parts SET total_quantity =${totalQuantity} WHERE internal_part_number = ${internal_part_number}`;
      await pool.query(addNewPartTotalQuantity);
    } else {
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
