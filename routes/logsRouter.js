const logsRouter = require("express").Router();
const pool = require("../db");

//gets all the rows for the inventory table
logsRouter.get("/", async(req, res) => {
  var rowsTableQuery0 ="SELECT logs.log_id, logs.event_type_name, logs.part_id, quantity_change_events.quantity_changed, '' AS old_location, '' AS new_location, '' AS old_status, '' AS new_status, '' AS convert_flag, logs.date_time, people.name FROM logs INNER JOIN quantity_change_events ON logs.log_id = quantity_change_events.log_id INNER JOIN people ON logs.user_id = people.user_id;"
  var rowsTableQuery1 ="SELECT logs.log_id, logs.event_type_name, logs.part_id, add_events.quantity_added, '' AS old_location, '' AS new_location, '' AS old_status, '' AS new_status, '' AS convert_flag, logs.date_time, people.name FROM logs INNER JOIN add_events ON logs.log_id = add_events.log_id INNER JOIN people ON logs.user_id = people.user_id;"
  var rowsTableQuery2 ="SELECT logs.log_id, logs.event_type_name, logs.part_id, convert_events.quantity_changed, '' AS old_location, '' AS new_location, '' AS old_status, '' AS new_status, convert_events.convert_flag, logs.date_time, people.name FROM logs INNER JOIN convert_events ON logs.log_id = convert_events.log_id INNER JOIN people ON logs.user_id = people.user_id;"
  var rowsTableQuery3 ="SELECT logs.log_id, logs.event_type_name, logs.part_id, delete_events.quantity, '' AS old_location, '' AS new_location, '' AS old_status, '' AS new_status, '' AS convert_flag, logs.date_time, people.name FROM logs INNER JOIN delete_events ON logs.log_id = delete_events.log_id INNER JOIN people ON logs.user_id = people.user_id;"
  var rowsTableQuery4 ="SELECT logs.log_id, logs.event_type_name, logs.part_id, relocation_events.quantity_changed, relocation_events.old_location, relocation_events.new_location, relocation_events.old_status, relocation_events.new_status, '' AS convert_flag, logs.date_time, people.name FROM logs INNER JOIN relocation_events ON logs.log_id = relocation_events.log_id INNER JOIN people ON logs.user_id = people.user_id;"
    
  try{
      console.log("0")
  var res0= await pool.query(rowsTableQuery0);
  var res1= await pool.query(rowsTableQuery1);
  var res2= await pool.query(rowsTableQuery2);
  var res3= await pool.query(rowsTableQuery3);
  var res4= await pool.query(rowsTableQuery4);

  var res5=res0.rows.concat(res1.rows,res2.rows,res3.rows,res4.rows)
  //console.log(res5);
  return res.status(200).send(res5)
} catch(e){
    return res.status(400).send(e);
}
});
module.exports = logsRouter;