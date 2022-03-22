const convertRouter = require("express").Router();
const req = require("express/lib/request");
const pool = require("../db");

const array = [];
const location_id=0;
const final_location_id=0;

convertRouter.post("/", async(req, res) => {
    

  var  conversionQuantity=req.body.conversionQuantity;
  var internal_part_number = req.body.internal_part_number;
  var ConvertPartsRouterQuery = `select * from wip where part_id = '${internal_part_number}';`;
  try{
      //get wip id and location id
  const wip_res=await pool.query(ConvertPartsRouterQuery)
  const wip_id=wip_res.rows[0].wip_id;
  location_id=wip_res.rows[0].location_id;
  //get formula
  var ConvertPartsRouterQuery2 = `select * from wip_parts where wip_id = ${wip_id};`;
  const wip_parts_res= await pool.query(ConvertPartsRouterQuery2);
//store formula in 2d array with IPN and quantity needed
  for(var i=0;i<wip_parts_res.rows.length;i++){
      array.push([wip_parts_res.rows[i].part_id],[wip_parts_res.rows[i].wip_part_quantity_needed]);
  }
  if(internal_part_number=="LIGHTSTAND"){
      final_location_id=2;
  } else
  final_location_id=location_id;
  //check
  for(var i=0;i<wip_parts_res.rows.length;i++){
    var ConvertPartsRouterQuery3 = `select * from part_quantity where internal_part_number = '${array[i][0]}' and location_id = ${location_id} and status_id=2;`;
    var part_quantity_res = await pool.query(ConvertPartsRouterQuery3);
    if(part_quantity_res.rows[0].quantity<array[i][1]*conversionQuantity){
        
        let rowResults = await pool.query(
            `SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.internal_part_number = part_categories.part_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id;`
          );
          
        let result = {rows : rowResults.rows, convertPossible : false}
        res.status(400).json(result);
    }
        
  }//get quantity
  for(var i=0;i<wip_parts_res.rows.length;i++){
    var ConvertPartsRouterQuery4 = `select * from part_quantity where internal_part_number = '${array[i][0]}' and location_id = ${location_id} and status_id=2;`;
    const part_quantity_quantity_res = await pool.query(ConvertPartsRouterQuery4);
    const quantity=part_quantity_quantity_res.rows[0].quantity;
    //update quantity
    var ConvertPartsRouterQuery5 = `update part_quantity set quantity=${quantity-array[i][1]*conversionQuantity} where internal_part_number = '${array[i][0]}' and location_id = ${location_id} and status_id=2;`;
    await pool.query(ConvertPartsRouterQuery5);
    //get total quantity
    var ConvertPartsRouterQuery6 = `select * from parts where internal_part_number = '${array[i][0]};'`;
    const parts_total_quantity_res = await pool.query(ConvertPartsRouterQuery6);
    const total_quantity=parts_total_quantity_res.rows[0].total_quantity;
    //update total quantity
    var ConvertPartsRouterQuery7 = `update parts set total_quantity=${total_quantity-array[i][1]*conversionQuantity} where internal_part_number = '${array[i][0]}';`;
    await pool.query(ConvertPartsRouterQuery7);
    

  }
    //get quantity for wip
    var ConvertPartsRouterQuery4 = `select * from part_quantity where internal_part_number = '${internal_part_number}' and location_id = ${final_location_id} and status_id=2;`;
    const part_quantity_quantity_res = await pool.query(ConvertPartsRouterQuery4);
    const quantity=part_quantity_quantity_res.rows[0].quantity;
    //update quantity for wip
    var ConvertPartsRouterQuery13 = `update part_quantity set quantity=${quantity+1*conversionQuantity} where internal_part_number = '${internal_part_number}' and location_id = ${final_location_id} and status_id=2;`;
    await pool.query(ConvertPartsRouterQuery13);
    //get total quantity for wip
    var ConvertPartsRouterQuery6 = `select * from parts where internal_part_number = '${internal_part_number}';`;
    const parts_total_quantity_res = await pool.query(ConvertPartsRouterQuery6);
    const total_quantity=parts_total_quantity_res.rows[0].total_quantity;
    //update total quantity for wip
    var ConvertPartsRouterQuery7 = `update parts set total_quantity=${total_quantity+1*conversionQuantity} where internal_part_number = '${internal_part_number}';`;
    await pool.query(ConvertPartsRouterQuery7);

    let rowResults = await pool.query(
        `SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.internal_part_number = part_categories.part_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id;`
      );
      
    let result = {rows : rowResults.rows, convertPossible : true}
    res.status(200).json(result);

  
} catch(e){
    let rowResults = await pool.query(
        `SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.internal_part_number = part_categories.part_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id;`
      );
      
    let result = {rows : rowResults.rows, convertPossible : false}
    res.status(400).json(result);
}

});

module.exports = convertRouter;
