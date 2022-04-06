const statusRouter = require("express").Router();
const pool = require("../db");

statusRouter.get("/", (req, res) => {
  var statusTableQuery = "SELECT * FROM statuses order by status_id;";

  pool.query(statusTableQuery, (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    var results = { rows: result.rows };
    res.json(results.rows);
  });
});

//add status to table
statusRouter.post("/add", async (req, res) => {


  var status_name = req.body.status_name;
  var note = req.body.note;
  //insert into status table query
  var addStatusTableQuery = `INSERT into statuses values(DEFAULT,'${status_name}','${note}');`;
  var checkStatusTableQuery = `select * from statuses where status_name = '${status_name}';`
  try {
    var result = await pool.query(checkStatusTableQuery);
    if (result.rows.length >= 1) {
      var returnQuery = `SELECT * FROM statuses order by status_id;`
      var resultRet = await pool.query(returnQuery)

      let resultsRet = { rows: resultRet.rows, canAdd: false };

      return res.status(200).json(resultsRet);


    }

    await pool.query(addStatusTableQuery)

    var returnQuery = `SELECT * FROM statuses order by status_id;`
    var resultFromReturnQuery = await pool.query(returnQuery)
    let results = { rows: resultFromReturnQuery.rows, canAdd: true };
    return res.status(200).json(results);
  } catch (e) {
    res.status(400).send(e);
  }
});

statusRouter.post("/edit", async (req, res) => {
  var status_id = req.body.status_id;
  var status_name = req.body.status_name;
  var note = req.body.note;
  var checkStatusTableQuery = `select * from statuses where status_name = '${status_name}';`
  var checkifEntry = `select * from statuses where status_id=${status_id} and status_name='${status_name}';`
  try {
    var checkResult = await pool.query(checkifEntry);
    if (checkResult.rows.length == 0) {
      var result = await pool.query(checkStatusTableQuery);
      if (result.rows.length >= 1) {
        var returnQuery = `SELECT * FROM statuses order by status_id;`
        var resultRet = await pool.query(returnQuery)

        let resultsRet = { rows: resultRet.rows, canEdit: false };

        return res.status(200).json(resultsRet);
      } else {
        var addStatusTableQuery = `UPDATE statuses SET status_name = '${status_name}',note='${note}' WHERE status_id = ${status_id};`;

        await pool.query(addStatusTableQuery);
        var returnQuery = `SELECT * FROM statuses order by status_id;`
        var resultRet = await pool.query(returnQuery)

        let resultsRet = { rows: resultRet.rows, canEdit: true };

        return res.status(200).json(resultsRet);
      }

    }

    var addStatusTableQuery = `UPDATE statuses SET status_name = '${status_name}',note='${note}' WHERE status_id = ${status_id};`;

    await pool.query(addStatusTableQuery);
    var returnQuery = `SELECT * FROM statuses order by status_id;`
    var resultRet = await pool.query(returnQuery)

    let resultsRet = { rows: resultRet.rows, canEdit: true };

    return res.status(200).json(resultsRet);

  } catch (e) {
    res.status(400).send(e);
  }
});

/*  Deletes a status from the statuses table.
    First checks if the status is attached to any entry in the part quantity table,
    if a part entry is using the status, then it does not go through.
    Otherwise, the status is deleted from the table.    */
statusRouter.post("/delete", async (req, res) => {
  var partsQuantityRows;

  var status_id = req.body.status_id;
  try {
    var partsQuantityQuery = `SELECT * FROM part_quantity WHERE status_id = ${status_id};`;
    const result = await pool.query(partsQuantityQuery);
    partsQuantityRows = result.rows;
    if (partsQuantityRows.length > 0) {

      var returnQuery = `SELECT * FROM statuses order by status_id;`
      var resultRet = await pool.query(returnQuery)

      let resultsRet = { rows: resultRet.rows, canDelete: false };

      return res.status(200).json(resultsRet);
    }

    var addStatusTableQuery = `DELETE FROM statuses WHERE status_id = ${status_id};`;

    await pool.query(addStatusTableQuery);
    var returnQuery = `SELECT * FROM statuses order by status_id;`
    var resultRet = await pool.query(returnQuery)

    let resultsRet = { rows: resultRet.rows, canDelete: true };

    return res.status(200).json(resultsRet);
  } catch (e) {
    console.log(e);
    res.status(400).json("error");
  }
});

module.exports = statusRouter;
