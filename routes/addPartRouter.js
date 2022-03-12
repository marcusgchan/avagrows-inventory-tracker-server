const addPartQuantityRouter = require("express").Router();
const pool = require("../db");

addPartQuantityRouter.post("/", (req, res) => {
    var internal_part_number /* = req.body */
    var location_id /* = req.body */
    var status_id /* = req.body */
    var quantity /* = req.body */
    var note /* = req.body */
    var results
    var resultsForEntry
    var resultsForTotalQuantity
    var totalQuantity
    var addNewPartQuantity = `INSERT INTO part_quantity values('${internal_part_number}', ${location_id}, ${status_id}, ${quantity}, '${note}';`
    var checkForDuplicates = `SELECT * FROM part_quantity WHERE internal_part_number = ${internal_part_number}, status_id = ${status_id}, location_id = ${location_id};`
    var checkForEntry = `SELECT * FROM parts WHERE internal_part_number = ${internal_part_number};`
    
    
    

    pool.query(checkForEntry,(error,result)=> {
        if(error){
            console.log(error);
            return;
            
        }
        resultsForEntry = result.rows;
    })
    if(resultsForEntry.length<1){
        return;
    }
        
    pool.query(checkForDuplicates,(error,result)=> {
        if(error){
            console.log(error);
            return;
            
        }
        results = result.rows;
    })

    if (results.length == 0) {
        pool.query(addNewPartQuantity,(error,result)=> {
            if(error){
                console.log(error);
                return;
            } else {
                console.log('Add Done')
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
        totalQuantity=resultsForTotalQuantity+quantity;
        var addNewPartTotalQuantity = `UPDATE parts SET total_quantity =${totalQuantity} WHERE internal_part_number = ${internal_part_number}`
        pool.query(addNewPartTotalQuantity,(error,result)=> {
            if(error){
                console.log(error);
                return;
            } else {
                console.log('update Done')
            }
        })

    } else {
        console.log('This part already exists at this location with this status!')
    }
});

module.exports = addPartQuantityRouter;