const deleteLocationRouter = require("express").Router();
const pool = require("../db");
var part_id

deleteLocationRouter.post("/", (req, res) => {
    var deleteLocationTableQuery = `DELETE FROM part_categories WHERE part_id = ${part_id};`
    var checkIfInUse = `SELECT * FROM part_quantity WHERE internal_part_number = ${part_id};`
    var results

    pool.query(checkIfInUse, (error, result) => {
        if (error) {
            return;
        }
        results = result.rows;
    });

    if (results.length < 1) {
        pool.query(deleteLocationTableQuery, (error, result) => {
            if (error) {
                return;
            }
            res.send(done);
        });
    } else {
        console.log('This part still exists in the inventory!')
    }
});

module.exports = deleteLocationRouter;