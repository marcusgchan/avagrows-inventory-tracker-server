const calibrateTotalQuantityRouter = require("express").Router();
const pool = require("../db");

// route that calibrates the total quantity if it was manually changed in the back end
calibrateTotalQuantityRouter.post("/", async (req, res) => {
  try {
    const result = await pool.query(
      `select distinct internal_part_number from parts`
    );
    let partNumbers = result.rows;

    for (let i = 0; i < partNumbers.length; i++) {
      let partNumber = partNumbers[i].internal_part_number;
      const results = await pool.query(
        `select * from part_quantity where internal_part_number = '${partNumber}'`
      );

      let parts = results.rows;
      let totalQuantity = 0;

      for (let j = 0; j < parts.length; j++) {
        totalQuantity += parts[j].quantity;
      }
      await pool.query(
        `update parts set total_quantity = '${totalQuantity}' where internal_part_number = '${partNumber}'`
      );
    }

    res.status(200).json("Updated total quantities");
  } catch (e) {
    res.status(400).json(e);
  }
});

module.exports = calibrateTotalQuantityRouter;
