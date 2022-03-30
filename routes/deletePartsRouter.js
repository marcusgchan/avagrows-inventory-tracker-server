const deletePartsRouter = require("express").Router();
const pool = require("../db");

deletePartsRouter.post("/", async (req, res) => {
  var partsQuantityRows;
  var internal_part_number = req.body.internal_part_number;
  try {
    var partsQuantityQuery = `SELECT * FROM part_quantity WHERE internal_part_number = '${internal_part_number}';`;
    const result = await pool.query(partsQuantityQuery);
    partsQuantityRows = result.rows;
    if (partsQuantityRows.length > 0) {
      res.status(400).json("error");
    }

    var addStatusTableQuery = `DELETE FROM parts WHERE internal_part_number = '${internal_part_number}';`;

    await pool.query(addStatusTableQuery);
  } catch (e) {
    res.status(400).json(e);
  }
});

module.exports = deletePartsRouter;
