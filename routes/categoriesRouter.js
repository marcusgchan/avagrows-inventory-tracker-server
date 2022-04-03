const categoriesRouter = require("express").Router();
const pool = require("../db");

function categoryID(name) {
  if (name === "raw material") {
    return 1;
  } else if (name === "work in progress") {
    return 2;
  } else if (name === "finished good") {
    return 3;
  } else {
    return 0;
  }
}
categoriesRouter.get("/distinct", (req, res) => {
  //select all parts from part category table
  var categoryTableQuery =
    "SELECT DISTINCT part_category_name FROM part_categories;";

  pool.query(categoryTableQuery, (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    var results = { rows: result.rows };
    res.json(results.rows);
  });
});

categoriesRouter.get("/", (req, res) => {
  //select all parts from part category table
  var categoryTableQuery = "SELECT * FROM part_categories;";

  pool.query(categoryTableQuery, (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    var results = { rows: result.rows };
    res.json(results.rows);
  });
});

/*  Edits an entry in the part category table with the updated information provided by the user.  */
categoriesRouter.post("/edit", async (req, res) => {
  try {
    let { part_id, part_category_name } = req.body;
    var new_part_category_id = categoryID(part_category_name);
    var editPartCategoryTableQuery = `UPDATE part_categories SET part_category_id = ${new_part_category_id}, part_category_name = '${part_category_name}' WHERE part_id = '${part_id}';`;

    await pool.query(editPartCategoryTableQuery);
    var resultRet = await pool.query(`SELECT * from part_categories`);

    let resultsRet = { rows: resultRet.rows, canEdit: true };
    return res.status(200).json(resultsRet);
  } catch (e) {
    return res.status(400).send(e);
  }
});

//add to part category table
categoriesRouter.post("/add", async (req, res) => {
  let { part_id, part_category_name } = req.body;
  var part_category_id = categoryID(part_category_name);
  var addPartCategoryTableQuery = `INSERT into part_categories values(${part_category_id},'${part_id}','${part_category_name}');`;
  var checkForDuplicates = `SELECT * FROM part_categories WHERE part_category_id = ${part_category_id} AND part_id = '${part_id}' AND part_category_name = '${part_category_name}';`;
  var checkIfPartExists = `SELECT * FROM parts WHERE internal_part_number = '${part_id}';`;

  try {
    // Query to check if part exists in the parts table before adding to the part category table.
    var partExistsResult = await pool.query(checkIfPartExists);
    if (partExistsResult.rows.length < 1) {
      var returnQuery = `SELECT * from part_categories`;
      var resultRet = await pool.query(returnQuery);

      let resultsRet = {
        rows: resultRet.rows,
        canAdd: false,
        partExists: false,
      };
      return res.status(200).json(resultsRet);
    }

    // Query to check if part is a duplicate in the part category table.
    var duplicateResult = await pool.query(checkForDuplicates);
    if (duplicateResult.rows.length >= 1) {
      var returnQuery = `SELECT * from part_categories`;
      var resultRet = await pool.query(returnQuery);

      let resultsRet = {
        rows: resultRet.rows,
        canAdd: false,
        partExists: true,
      };

      return res.status(200).json(resultsRet);
    }
    // Query to add part category into table
    await pool.query(addPartCategoryTableQuery);

    var results = await pool.query(`SELECT * FROM part_categories`);
    let resultsRet = { rows: results.rows, canAdd: true, partExists: true };
    return res.status(200).json(resultsRet);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/*  Deletes a part from the part_categories table. 
    First checks if there is a part in the part_quantity table with the same internal part number.
    If there are, this function does not allow the user to delete the category information entry.
    Otherwise, the entry is removed. */

categoriesRouter.post("/delete", async (req, res) => {
  var part_id = req.body.part_id;
  var deletePartCategoryTableQuery = `DELETE FROM part_categories WHERE part_id = '${part_id}';`;
  var checkIfInUse = `SELECT * FROM part_quantity WHERE internal_part_number ='${part_id}';`;
  try {
    var partInUse = await pool.query(checkIfInUse);
    if (partInUse.rows.length >= 1) {
      var results = await pool.query(`SELECT * FROM part_categories`);
      let resultsRet = { rows: results.rows, canDelete: false };
      return res.status(200).json(resultsRet);
    }

    await pool.query(deletePartCategoryTableQuery);

    var results = await pool.query(`SELECT * FROM part_categories`);
    let resultsRet = { rows: results.rows, canDelete: true };
    return res.status(200).json(resultsRet);
  } catch (e) {
    return res.status(400).send(e);
  }
});

module.exports = categoriesRouter;
