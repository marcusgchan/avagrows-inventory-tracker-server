const unconvertRouter = require("express").Router();
const pool = require("../db");

// change location of items
unconvertRouter.post("/", async (req, res) => {
    let {
        internal_part_number,
        quantity,
        location_id,
        status_id,
        new_location_id,
        new_status_id,
        convertQty,
      } = req.body;
});

module.exports = unconvertRouter;