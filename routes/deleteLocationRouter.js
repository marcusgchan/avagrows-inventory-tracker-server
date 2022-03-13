const deleteLocationRouter = require("express").Router();
const pool = require("../db");
var location_id

deleteLocationRouter.post("/", (req, res) => {
    var deleteLocationTableQuery = `DELETE FROM locations WHERE location_id = ${location_id};`
    var checkIfInUse = `SELECT * FROM part_quantity WHERE location_id = ${location_id};`
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
        console.log('This location is still in use!')
    }
});

module.exports = deleteLocationRouter;