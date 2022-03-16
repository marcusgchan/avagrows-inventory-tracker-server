const addPartsRouter = require("express").Router();
const pool = require("../db");
var internal_part_number;
var part_name;
var manufacture_name;
var manufacture_part_number;
var item_description;
var unit_price;
var line_price;
var lead_time;
var total_quantity;
var category_id;
//add part to parts table
addPartsRouter.post("/", (req, res) => {
    //query to insert into parts table
  var addPartsTableQuery = `INSERT into statuses values('${internal_part_number}','${part_name}','${manufacture_name}','${manufacture_part_number}','${item_description}','${unit_price}','${line_price}','${lead_time}',${total_quantity},${category_id};`;

  pool.query(addPartsTableQuery, (error, result) => {
    if (error) {
      return;
    }

    res.send(`done`);
  });
});

module.exports = addPartsRouter;
