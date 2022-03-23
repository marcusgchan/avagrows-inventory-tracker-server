const checkPartExistsRouter = require("express").Router();
const pool = require("../db");

checkPartExistsRouter.post("/", async (req, res) => {
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

module.exports = checkPartExistsRouter;
