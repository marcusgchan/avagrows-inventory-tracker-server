const changeLocationQuatityRouter = require("express").Router();
const pool = require("../db");

changeLocationQuatityRouter.post("/", (req, res) => {
    var internal_part_number=req.body.internal_part_number;
    var oldLocation;
    var oldStatus;
    var oldQuantity;
    var newLocation;
    var newStatus;
    var newQuantity;
    var amountToChange;
    
    if((oldQuantity-amountToChange)<0){
        console.log("error, not enough quantity");
        return;
    } else{
        var newOldQuantity=oldQuantity-amountToChange;
        var newNewQuantity=newquantity+amountToChange;
        var results2;
        var results;
        
        
        var changeLocationQuatityTableQuery = `UPDATE part_quantity SET quantity =${newOldQuantity} WHERE internal_part_number = ${internal_part_number},status_id = ${oldStatus},location_id = ${oldLocation};`;
        var changeLocationQuatityTableQuery2 = `UPDATE part_quantity SET quantity =${newNewQuantity} WHERE internal_part_number = ${internal_part_number},status_id = ${newStatus},location_id = ${newLocation};`;
        var changeLocationQuatityTableQuery3 = `select * from part_quantity WHERE internal_part_number = ${internal_part_number},status_id = ${newStatus},location_id = ${newLocation};`;
        var changeLocationQuatityTableQuery4 = `insert into part_quantity values ('${internal_part_number}','${newLocation}','${newStatus}',${amountToChange},' ' );`
        pool.query(changeLocationQuatityTableQuery3,(error,result)=> {
            if(error){
                console.log(error);
                return;
                
            }
            results2 = result.rows;
            console.log(results2.length);
            
        })
        
        if(results2.length==0){
            pool.query(changeLocationQuatityTableQuery4,(error,result)=> {
                if(error){
                    console.log(error);
                    return;
                    
                } else
                
                console.log('Done');
                
            })
            pool.query(changeLocationQuatityTableQuery,(error,result)=> {
                if(error){
                    console.log(error);
                    return;
                    
                }
                
                console.log('Done');
                
            })
        }else{
            pool.query(changeLocationQuatityTableQuery,(error,result)=> {
                if(error){
                    console.log(error);
                    return;
                }     else
                
                
                console.log('done');
            })
            pool.query(changeLocationQuatityTableQuery2,(error,result)=> {
                if(error){
                    console.log(error);
                    return;
                } else
                
                console.log('done');
                
            })
            
            
            
        }
    }
});

module.exports = changeLocationQuatityRouter;