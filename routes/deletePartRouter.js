const deletePartRouter = require("express").Router();
const pool = require("../db");

deletePartRouter.post("/", (req, res) => {
    var internal_part_number /* = req.body */
    var deleteFromAllTables = `DELETE FROM parts WHERE internal_part_number = ${internal_part_number}; DELETE FROM part_quantity WHERE internal_part_number = ${internal_part_number}; DELETE FROM part_categories WHERE part_id = ${internal_part_number};`;

    pool.query(deleteFromAllTables,(error,result)=> {
        if(error){
            console.log(error);
            return;
        } else {
            console.log('Delete Done')
        }
    })
});

module.exports = deletePartRouter;