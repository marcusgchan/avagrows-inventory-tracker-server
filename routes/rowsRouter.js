const rowsRouter = require("express").Router();
const pool = require("../db");

rowsRouter.get("/", (req, res) => {
  var rowsTableQuery =
    "SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.internal_part_number = part_categories.part_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id;";
  pool.query(rowsTableQuery, (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    var results = { rows: result.rows };
    res.json(results.rows);
  });
});

module.exports = rowsRouter;