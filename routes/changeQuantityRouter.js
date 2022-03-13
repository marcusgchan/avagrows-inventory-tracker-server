const changeQuantityRouter = require("express").Router();
const pool = require("../db");

changeQuantityRouter.post("/", async(req, res) => {
    var old_quantity /* place old quantity in a hidden input for access */
    var new_quantity /* = req.body */
    var total_quantity /* = req.body */
    var internal_part_number /* = req.body */
    var location_id /* = req.body */
    var status_id /* = req.body */
    var changeQuantityTableQuery = `UPDATE part_quantity SET quantity = ${new_quantity} WHERE internal_part_number =${internal_part_number}, location_id =${location_id}, status_id =${status_id};`;
    var changeTotalQuantityTableQuery = `UPDATE parts SET total_quantity = ${total_quantity + new_quantity - old_quantity} WHERE internal_part_number =${internal_part_number};`;
    var checkForEntry = `SELECT * FROM parts WHERE internal_part_number = ${internal_part_number};`
    
    try{
    
        await pool.query(changeQuantityTableQuery);
        const result=await pool.query(checkForEntry);
        total_quantity=result.rows[0].total_quantity;
        await pool.query(changeTotalQuantityTableQuery)

    }
    catch(e){
        console.log(e);
                return;
    }
        
    
        
     
});

module.exports = changeQuantityRouter;