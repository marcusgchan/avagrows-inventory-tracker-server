const partsRouter = require("express").Router();
const res = require("express/lib/response");
const pool = require("../db");
const authenticate = require("../authenticate");

// a function that gets the corresponding category id from a category name
// returns 0 if no id exits for a name
async function getCategoryID(name) {
  try {
    const categories = await pool.query(
      `SELECT * FROM part_categories where part_category_name = '${name}'`
    );
    if (categories.rows.length === 0) {
      return 0;
    } else {
      let categoryId = categories.rows[0].part_category_id;
      return categoryId;
    }
  } catch (e) {
    res.status(400).send(e);
  }
}

partsRouter.get("/", authenticate, (req, res) => {
  var partsTableQuery =
    "SELECT * FROM parts INNER JOIN part_categories on parts.category_id = part_categories.part_category_id order by internal_part_number;";

  pool.query(partsTableQuery, (error, result) => {
    if (error) {
      res.status(400).log(error);
      return;
    }
    var results = { rows: result.rows };
    res.status(200).json(results.rows);
  });
});

//add part to parts table
partsRouter.post("/add", authenticate, async (req, res) => {
  let {
    internal_part_number,
    part_name,
    part_category_name,
    part_description,
    unit_price,
    line_price,
    lead_time,
  } = req.body;

  let category_id = 0;
  let manufacture_name = null;
  let manufacture_part_number = null;

  try {
    category_id = await getCategoryID(part_category_name);
  } catch (e) {
    res.status(400).send(e);
  }

  if (category_id === 0) {
    var returnQuery =
      "SELECT * FROM parts INNER JOIN part_categories on parts.category_id = part_categories.part_category_id order by internal_part_number;";
    var resultRet = await pool.query(returnQuery);

    let resultsRet = {
      rows: resultRet.rows,
      canAdd: false,
      categoryExists: false,
    };

    return res.status(200).json(resultsRet);
  }

  try {
    // Query to insert into parts table
    var addPartsTableQuery = `INSERT into parts values('${internal_part_number}','${part_name}','${manufacture_name}','${manufacture_part_number}','${part_description}','${unit_price}','${line_price}','${lead_time}',0,${category_id});`;
    var checkForDuplicates = `SELECT * FROM parts where internal_part_number = '${internal_part_number}'`;

    var duplicateResult = await pool.query(checkForDuplicates);
    if (duplicateResult.rows.length >= 1) {
      var results = await pool.query(
        `SELECT * FROM parts INNER JOIN part_categories on parts.category_id = part_categories.part_category_id order by internal_part_number;`
      );
      let resultsRet = {
        rows: results.rows,
        canAdd: false,
        categoryExists: true,
      };

      return res.status(200).json(resultsRet);
    }

    await pool.query(addPartsTableQuery);

    var results = await pool.query(
      `SELECT * FROM parts INNER JOIN part_categories on parts.category_id = part_categories.part_category_id order by internal_part_number;`
    );
    let resultsRet = { rows: results.rows, canAdd: true, categoryExists: true };

    return res.status(200).json(resultsRet);
  } catch (e) {
    return res.status(400).send(e);
  }
});

partsRouter.post("/delete", authenticate, async (req, res) => {
  var internal_part_number = req.body.internal_part_number;
  try {
    var partsQuantityQuery = `SELECT * FROM part_quantity where internal_part_number = '${internal_part_number}';`;
    const result = await pool.query(partsQuantityQuery);
    var partsQuantityRows = result.rows;
    if (partsQuantityRows.length > 0) {
      var results = await pool.query(
        `SELECT * FROM parts INNER JOIN part_categories on parts.category_id = part_categories.part_category_id order by internal_part_number;`
      );
      let resultsRet = {
        rows: results.rows,
        canDelete: false,
        categoryExists: false,
      };

      return res.status(200).json(resultsRet);
    }

    var addStatusTableQuery = `DELETE FROM parts WHERE internal_part_number = '${internal_part_number}';`;

    await pool.query(addStatusTableQuery);
    var results = await pool.query(
      `SELECT * FROM parts INNER JOIN part_categories on parts.category_id = part_categories.part_category_id order by internal_part_number;`
    );
    let resultsRet = {
      rows: results.rows,
      canDelete: true,
      categoryExists: false,
    };

    return res.status(200).json(resultsRet);
  } catch (e) {
    return res.status(400).json(e);
  }
});

partsRouter.post("/edit", authenticate, async (req, res) => {
  let {
    internal_part_number,
    part_name,
    part_category_name,
    part_description,
    unit_price,
    line_price,
    lead_time,
  } = req.body;

  let category_id = 0;
  let manufacture_name = null;
  let manufacture_part_number = null;

  try {
    category_id = await getCategoryID(part_category_name);
  } catch (e) {
    res.status(400).send(e);
  }

  if (category_id === 0) {
    var returnQuery =
      "SELECT * FROM parts INNER JOIN part_categories on parts.category_id = part_categories.part_category_id order by internal_part_number;";
    var resultRet = await pool.query(returnQuery);

    let resultsRet = {
      rows: resultRet.rows,
      canEdit: false,
      categoryExists: false,
    };

    return res.status(200).json(resultsRet);
  }

  try {
    var editPartsTableQuery = `UPDATE parts SET part_name ='${part_name}',manufacturer_name='${manufacture_name}',manufacturer_part_number='${manufacture_part_number}',item_description='${part_description}',unit_price='${unit_price}',line_price='${line_price}',lead_time='${lead_time}',category_id=${category_id} where internal_part_number='${internal_part_number}';`;
    await pool.query(editPartsTableQuery);

    var results = await pool.query(
      `SELECT * FROM parts INNER JOIN part_categories on parts.category_id = part_categories.part_category_id order by internal_part_number;`
    );
    let resultsRet = {
      rows: results.rows,
      canEdit: true,
      categoryExists: true,
    };
    return res.status(200).json(resultsRet);
  } catch (e) {
    return res.status(400).send(e);
  }
});

partsRouter.post("/checkPartExists", authenticate, async (req, res) => {
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
