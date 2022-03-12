const deletePartRouter = require("express").Router();
const pool = require("../db");

deletePartRouter.post("/", (req, res) => {
    var internal_part_number /* = req.body */
    var location_id;
    var status_id;
    var deleteFromAllTables = ` DELETE FROM part_quantity WHERE internal_part_number = ${internal_part_number}, location_id = ${location_id}, status_id = ${status_id};`;
    var partsQuantityQuery = `SELECT * FROM part_quantity WHERE internal_part_number = ${internal_part_number}, status_id = ${status_id}, location_id = ${location_id};`
    var checkForEntry = `SELECT * FROM parts WHERE internal_part_number = ${internal_part_number};`
    var resultsForTotalQuantity
    var quantity
    var totalQuantity

    pool.query(partsQuantityQuery,(error,result)=> {
        if(error){
            console.log(error);
            return;
        } else {
            quantity=result.rows[0].quantity;
        }
    })
    
    pool.query(deleteFromAllTables,(error,result)=> {
        if(error){
            console.log(error);
            return;
        } else {
            console.log('Delete Done')
        }
    })
    pool.query(checkForEntry,(error,result)=> {
        if(error){
            console.log(error);
            return;
        } else {
            resultsForTotalQuantity=result.rows[0].total_quantity;
        }
    })
    totalQuantity=resultsForTotalQuantity-quantity;
    var addNewPartTotalQuantity = `UPDATE parts SET total_quantity = ${totalQuantity} WHERE internal_part_number = ${internal_part_number}`
    pool.query(addNewPartTotalQuantity,(error,result)=> {
        if(error){
            console.log(error);
            return;
        } else {
            console.log('update Done')
        }
    })
});

module.exports = deletePartRouter;