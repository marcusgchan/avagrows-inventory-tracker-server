const changeQuantityRouter = require("express").Router();
const pool = require("../db");

changeQuantityRouter.post("/", (req, res) => {
    var old_quantity /* place old quantity in a hidden input for access */
    var new_quantity /* = req.body */
    var total_quantity /* = req.body */
    var internal_part_number /* = req.body */
    var location_id /* = req.body */
    var status_id /* = req.body */
    var changeQuantityTableQuery = `UPDATE part_quantity SET quantity = ${new_quantity} WHERE internal_part_number =${internal_part_number}, location_id =${location_id}, status_id =${status_id};`;
    var changeTotalQuantityTableQuery = `UPDATE parts SET total_quantity = ${total_quantity + new_quantity - old_quantity} WHERE internal_part_number =${internal_part_number};`;
    
    if (new_quantity >= 0) {
        pool.query(changeQuantityTableQuery,(error,result)=> {
            if(error){
                console.log(error);
                return;
            } else {
                console.log('Change Quantity Done')
            }
        })
    
        pool.query(changeTotalQuantityTableQuery,(error,result)=> {
            if(error){
                console.log(error);
                return;
            } else {
                console.log('Change Total Quantity Done')
            }
        })
    } else {
        console.log('The New Quantity is Invalid (front end guys screwed up)!')
    }
});

module.exports = changeQuantityRouter;