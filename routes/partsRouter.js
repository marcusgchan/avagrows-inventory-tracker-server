const partsRouter = require("express").Router();
const pool = require("../db");

partsRouter.get("/", (req, res) => {
  var partsTableQuery = "SELECT * FROM parts;";

  pool.query(partsTableQuery, (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    var results = { rows: result.rows };
    res.json(results.rows);
  });
});

//add part to parts table
partsRouter.post("/add", (req, res) => {
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
      res.status(400).json("error");
      return;
    }

    res.status(200).json("done");
  });
});

partsRouter.post("/delete", async (req, res) => {
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

partsRouter.post("/edit", (req, res) => {
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
    total_quantity,
    category_id,
  } = req.body;

  var editPartsTableQuery = `UPDATE parts SET internal_part_number = '${internal_part_number}', part_name ='${part_name}',manufacturer_name='${manufacture_name}',manufacturer_part_number='${manufacture_part_number}',item_description='${item_description}',unit_price='${unit_price}',line_price='${line_price}',lead_time='${lead_time}',total_quantity=${total_quantity},category_id=${category_id} where internal_part_number='${old_internal_part_number}';`;

  pool.query(editPartsTableQuery, (error, result) => {
    if (error) {
      res.status(400).json("error");
    }

    res.status(200).json("done");
  });
});

partsRouter.post("/checkPartExists", async (req, res) => {
  let partNumber = req.body.partNumber;

  try {
    let results = await pool.query(
      `select * from parts where internal_part_number = '${partNumber}'`
    );

    if (results.rows.length !== 0) {
      res.status(200).send(true);
    } else {
      res.status(200).send(false);
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = partsRouter;
