const addPartsRouter = require("express").Router();
const req = require("express/lib/request");
const pool = require("../db");

//add part to parts table
addPartsRouter.post("/", (req, res) => {
  let {
    internal_part_number,
    part_name,
    manufacture_name,
    manufacture_part_number,
    item_description,
    unit_price,
    line_price,
    lead_time,
    total_quantity,
    category_id,
  } = req.body;
  //query to insert into parts table
  var addPartsTableQuery = `INSERT into parts values('${internal_part_number}','${part_name}','${manufacture_name}','${manufacture_part_number}','${item_description}','${unit_price}','${line_price}','${lead_time}',${total_quantity},${category_id});`;

  pool.query(addPartsTableQuery, (error, result) => {
    if (error) {
      res.status(400).json("error")
      return;
    }

    res.status(200).json("done");;
  });
});

module.exports = addPartsRouter;
