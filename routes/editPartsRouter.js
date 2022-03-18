const editPartsRouter = require("express").Router();
const pool = require("../db");

/*  Edits an entry in the locations table with the updated information provided by the user.  */

var internal_part_number;
var old_internal_part_number;
var part_name;
var manufacture_name;
var manufacture_part_number;
var item_description;
var unit_price;
var line_price;
var lead_time;
var total_quantity;
var category_id;

editPartsRouter.post("/", (req, res) => {
  var editPartsTableQuery = `UPDATE statuses SET internal_parts_number = '${internal_part_number}', part_name ='${part_name}',manufacture_name='${manufacture_name}',manufacture_part_number='${manufacture_part_number}',item_description='${item_description}',unit_price='${unit_price}',line_price='${line_price}',lead_time='${lead_time}',total_quantity=${total_quantity},category_id=${category_id} where internal_part_number=${old_internal_part_number};`;

  pool.query(editPartsTableQuery, (error, result) => {
    if (error) {
      return;
    }

    res.send(`done`);
  });
});

module.exports = editPartsRouter;
