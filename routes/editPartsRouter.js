const editPartsRouter = require("express").Router();
const req = require("express/lib/request");
const pool = require("../db");

/*  Edits an entry in the locations table with the updated information provided by the user.  */

editPartsRouter.post("/", (req, res) => {
  let {
    internal_part_number,
    old_internal_part_number,
    part_name,
    manufacture_name,
    manufacture_part_number,
    item_description,
    unit_price,
    line_price,
    lead_time,
    category_id,
  } = req.body;

  var editPartsTableQuery = `UPDATE parts SET internal_part_number = '${internal_part_number}', part_name ='${part_name}',manufacturer_name='${manufacture_name}',manufacturer_part_number='${manufacture_part_number}',item_description='${item_description}',unit_price='${unit_price}',line_price='${line_price}',lead_time='${lead_time}',category_id=${category_id} where internal_part_number='${old_internal_part_number}';`;

  pool.query(editPartsTableQuery, (error, result) => {
    if (error) {
      res.status(400).json("error");
    }

    res.status(200).json("done")
  });
});

module.exports = editPartsRouter;
