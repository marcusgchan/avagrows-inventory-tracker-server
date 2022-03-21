const checkPartExistsRouter = require("express").Router();
const pool = require("../db");

checkPartExistsRouter.get("/", async (req, res) => {
  let partNumber = req.body;

  try {
    let result = await pool.query(
      `select * from parts where internal_part_number = '${partNumber}'`
    );

    if (result.rows.length !== 0) {
      res.status(200).send(true);
    } else {
      res.status(200).send(false);
    }
  } catch (e) {
    res.status(400).json(e);
  }
});

module.exports = checkPartExistsRouter;
