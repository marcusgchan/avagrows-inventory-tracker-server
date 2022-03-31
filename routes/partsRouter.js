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
partsRouter.post("/add", async (req, res) => {
  let {
    internal_part_number,
    part_name,
    manufacture_name,
    manufacture_part_number,
    item_description,
    unit_price,
    line_price,
    lead_time,
    category_id,
  } = req.body;

  // Query to insert into parts table
  var addPartsTableQuery = `INSERT into parts values('${internal_part_number}','${part_name}','${manufacture_name}','${manufacture_part_number}','${item_description}','${unit_price}','${line_price}','${lead_time}',0,${category_id});`;
  var checkForDuplicates = `SELECT * FROM parts where internal_part_number = '${internal_part_number}'`

  var duplicateResult = await pool.query(checkForDuplicates)
  if (duplicateResult.rows.length >= 1) {
    var returnQuery = `SELECT * from parts`;
    var resultRet = await pool.query(returnQuery)

    let resultsRet = { rows: resultRet.rows, canAdd: false };

    return res.status(200).json(resultsRet);
  }

  await pool.query(addPartsTableQuery)

  var results = await pool.query(`SELECT * FROM parts`)
  let resultsRet = { rows: results.rows, canAdd: true };

  return res.status(200).json(resultsRet);
});

partsRouter.post("/delete", async (req, res) => {

  var internal_part_number = req.body.internal_part_number;
  try {
    var partsQuantityQuery = `SELECT * FROM part_quantity WHERE internal_part_number = '${internal_part_number}';`;
    const result = await pool.query(partsQuantityQuery);
    var partsQuantityRows = result.rows;
    if (partsQuantityRows.length > 0) {
      var results = await pool.query(`SELECT * FROM parts`)
      let resultsRet = { rows: results.rows, canDelete: false };
  
      return res.status(200).json(resultsRet);
    }

    var addStatusTableQuery = `DELETE FROM parts WHERE internal_part_number = '${internal_part_number}';`;

    await pool.query(addStatusTableQuery);
    var results = await pool.query(`SELECT * FROM parts`)
    let resultsRet = { rows: results.rows, canDelete: true };
  
    return res.status(200).json(resultsRet);

  } catch (e) {
    return res.status(400).json(e);
  }
});

partsRouter.post("/edit", async (req, res) => {
  let {
    internal_part_number,
    part_name,
    manufacture_name,
    manufacture_part_number,
    item_description,
    unit_price,
    line_price,
    lead_time,
    category_id,
  } = req.body;

  var checkForDuplicates = `SELECT * FROM parts where internal_part_number = '${internal_part_number}'`

  var duplicateResult = await pool.query(checkForDuplicates)
  if (duplicateResult.rows.length >= 1) {
    var returnQuery = `SELECT * from parts`;
    var resultRet = await pool.query(returnQuery)

    let resultsRet = { rows: resultRet.rows, canEdit: false };

    return res.status(200).json(resultsRet);
  }

  var editPartsTableQuery = `UPDATE parts SET part_name ='${part_name}',manufacturer_name='${manufacture_name}',manufacturer_part_number='${manufacture_part_number}',item_description='${item_description}',unit_price='${unit_price}',line_price='${line_price}',lead_time='${lead_time}',category_id=${category_id} where internal_part_number='${old_internal_part_number}';`;
  await pool.query(editPartsTableQuery)

  var results = await pool.query(`SELECT * FROM parts`)
  let resultsRet = { rows: results.rows, canEdit: true };
  return res.status(200).json(resultsRet)
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
