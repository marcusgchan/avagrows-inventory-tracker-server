const categoriesRouter = require("express").Router();
const pool = require("../db");

categoriesRouter.get("/", (req, res) => {
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

/*  Edits an entry in the part category table with the updated information provided by the user.  */
categoriesRouter.post("/edit", (req, res) => {
  let { new_part_category_id, part_id, part_category_name } = req.body;
  var editPartCategoryTableQuery = `UPDATE part_categories SET part_category_id = ${new_part_category_id}, part_id = '${part_id}', part_category_name = '${part_category_name}' WHERE part_id = '${part_id}';`;

  pool.query(editPartCategoryTableQuery, (error, result) => {
    if (error) {
      res.status(400).json(error);
    }
    res.status(200).json("done");
  });
});

//add to part category table
categoriesRouter.post("/add", (req, res) => {
  let { part_category_id, part_id, part_category_name } = req.body;
  var addPartCategoryTableQuery = `INSERT into part_categories values(${part_category_id},'${part_id}','${part_category_name}');`;
  //querry to add part category into table
  pool.query(addPartCategoryTableQuery, (error, result) => {
    if (error) {
      res.status(200).json("error");
    }
    res.status(200).json("done");
  });
});

/*  Deletes a part from the part_categories table. 
    First checks if there is a part in the part_quantity table with the same internal part number.
    If there are, this function does not allow the user to delete the category information entry.
    Otherwise, the entry is removed. */
categoriesRouter.post("/delete", async (req, res) => {
  var part_id = req.body.part_id;
  var part_category_id = req.body.part_category_id;
  var part_category_name = req.body.part_category_name;
  var deletePartCategoryTableQuery = `DELETE FROM part_categories WHERE part_id = '${part_id}' and part_category_name = '${part_category_name}' and part_category_id = ${part_category_id};`;
  var checkIfInUse = `SELECT * FROM part_quantity WHERE internal_part_number ='${part_id}';`;
  var results;

  try {
    const result = await pool.query(checkIfInUse);
    results = result.rows;

    if (results.length < 1) {
      await pool.query(deletePartCategoryTableQuery);
      res.status(200).json(deletePartCategoryTableQuery);
    } else {
      console.log("This part still exists in the inventory!");
    }
  } catch (e) {
    console.log(e);
    res.status(400).end();
  }
});

module.exports = categoriesRouter;
