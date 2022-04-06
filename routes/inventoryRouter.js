const inventoryRouter = require("express").Router();
const pool = require("../db");

//gets all the rows for the inventory table
inventoryRouter.get("/", (req, res) => {
  var rowsTableQuery =
    "SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.category_id = part_categories.part_category_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id order by internal_part_number;";
  pool.query(rowsTableQuery, (error, result) => {
    if (error) {
      return res.status(400).send(error);
    }
    var results = { rows: result.rows };
    res.json(results.rows);
  });
});

// change quantity of a row (part at a specific location and specific status) in the inventory table
inventoryRouter.post("/changeQuantity", async (req, res) => {
  let {
    old_quantity,
    new_quantity,
    total_quantity,
    internal_part_number,
    location_id,
    status_id,
    user_id,
  } = req.body;

  //query to update part to new value
  var changeQuantityTableQuery = `UPDATE part_quantity SET quantity = ${new_quantity} WHERE internal_part_number ='${internal_part_number}' AND location_id =${location_id} AND status_id =${status_id};`;
  //query to update parts table
  var changeTotalQuantityTableQuery = `UPDATE parts SET total_quantity = ${
    total_quantity + new_quantity - old_quantity
  } WHERE internal_part_number ='${internal_part_number}';`;

  //check parts table for an entry
  var checkForEntry = `SELECT * FROM parts WHERE internal_part_number = '${internal_part_number}';`;

  try {
    //change quantity to new value
    await pool.query(changeQuantityTableQuery);

    // check for entry in parts table
    const result = await pool.query(checkForEntry);
    total_quantity = result.rows[0].total_quantity;

    // update total quantity in parts table
    await pool.query(changeTotalQuantityTableQuery);

    // Generates a log.
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;

    today = mm + "/" + dd + "/" + yyyy + "/" + strTime;

    let loggingQuery = `insert into logs values( nextval('logs_log_id_seq'),${user_id},'${internal_part_number}',1,'${today}','','Quantity changed') returning log_id;`;
    let log_id = await pool.query(loggingQuery);

    let eventQuery = `insert into quantity_change_events values(${
      log_id.rows[0].log_id
    },1,${new_quantity - old_quantity});`;
    await pool.query(eventQuery);

    let rowResults = await pool.query(
      `SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.category_id = part_categories.part_category_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id order by internal_part_number;`
    );
    res.status(200).json(rowResults.rows);
  } catch (e) {
    res.status(400).end();
    return;
  }
});

// deltes a row (part at a specific location and specific status) in the inventory table
inventoryRouter.post("/delete", async (req, res) => {
  const { internal_part_number, location_id, status_id, user_id } = req.body;

  var deleteFromAllTables = `DELETE FROM part_quantity WHERE internal_part_number = '${internal_part_number}' AND location_id = '${location_id}' AND status_id = '${status_id}'`;
  var partsQuantityQuery = `SELECT * FROM part_quantity WHERE internal_part_number = '${internal_part_number}' AND status_id = '${status_id}' AND location_id = '${location_id}'`;
  var checkForEntry = `SELECT * FROM parts WHERE internal_part_number = '${internal_part_number}'`;
  var resultsForTotalQuantity;
  var quantity;
  var totalQuantity;
  try {
    const result = await pool.query(partsQuantityQuery);
    if (result.rows.length === 0) {
      let rowResults = await pool.query(
        `SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.category_id = part_categories.part_category_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id order by internal_part_number;`
      );

      let result = { rows: rowResults.rows, deletePossible: false };
      return res.status(200).json(result);
    }
    quantity = result.rows[0].quantity;

    await pool.query(deleteFromAllTables);

    const result2 = await pool.query(checkForEntry);

    resultsForTotalQuantity = result2.rows[0].total_quantity;

    totalQuantity = resultsForTotalQuantity - quantity;
    var addNewPartTotalQuantity = `UPDATE parts SET total_quantity = '${totalQuantity}' WHERE internal_part_number = '${internal_part_number}'`;
    await pool.query(addNewPartTotalQuantity);

    // Generates a log.
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;

    today = mm + "/" + dd + "/" + yyyy + "/" + strTime;

    let loggingQuery = `insert into logs values( nextval('logs_log_id_seq'),${user_id},'${internal_part_number}',5,'${today}','','Deleted Part') returning log_id;`;
    let log_id = await pool.query(loggingQuery);

    let eventQuery = `insert into delete_events values(${log_id.rows[0].log_id},5,'${internal_part_number}',${quantity});`;
    await pool.query(eventQuery);

    let rowResults = await pool.query(
      `SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.category_id = part_categories.part_category_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id order by internal_part_number;`
    );
    res.status(200).json(rowResults.rows);
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: "Bad request" });
  }
});

//add part (creates a row with a unique combination of internal_part_number, status_id,
//and location_id to the table) to part quantity table
inventoryRouter.post("/addParts", async (req, res) => {
  let {
    internal_part_number,
    location_id,
    status_id,
    quantity,
    note,
    total_quantity,
    user_id,
  } = req.body;

  //query to insert into parts quantity table
  let addNewPartQuantity = `INSERT INTO part_quantity values('${internal_part_number}', '${location_id}', '${status_id}', '${quantity}', '${note}', DEFAULT);`;
  //query to check for dublicates in table
  let checkForDuplicates = `SELECT * FROM part_quantity WHERE internal_part_number = '${internal_part_number}' AND status_id = ${status_id} AND location_id = ${location_id};`;
  //query to check parts table for entry
  let checkForEntry = `SELECT * FROM parts WHERE internal_part_number = '${internal_part_number}';`;

  try {
    //first check the parts table for entry
    const result = await pool.query(checkForEntry);
    let resultsForEntry = result.rows;

    //if no entry, then we want to cancel the operation
    if (resultsForEntry.length < 1) {
      res.status(400).json("No such internal part number exists");
    }
    //if an entry exists then check to see it is not already in the part quantity table
    const result2 = await pool.query(checkForDuplicates);
    let results = result2.rows;

    //if no entry create a new entry and update total quantity
    if (results.length == 0) {
      await pool.query(addNewPartQuantity);

      let updatedQuantity = Number(total_quantity) + Number(quantity);

      //update the total quantity in the parts table
      let addNewPartTotalQuantity = `UPDATE parts SET total_quantity = '${updatedQuantity}' WHERE internal_part_number = '${internal_part_number}'`;
      await pool.query(addNewPartTotalQuantity);

      // Generates a log.
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      var hours = today.getHours();
      var minutes = today.getMinutes();
      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;

      today = mm + "/" + dd + "/" + yyyy + "/" + strTime;

      let loggingQuery = `insert into logs values( nextval('logs_log_id_seq'),${user_id},'${internal_part_number}',4,'${today}','','Added Part') returning log_id;`;
      let log_id = await pool.query(loggingQuery);

      let eventQuery = `insert into add_events values(${log_id.rows[0].log_id},4,'${internal_part_number}',${quantity});`;
      await pool.query(eventQuery);

      let rowResults = await pool.query(
        `SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.category_id = part_categories.part_category_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id order by internal_part_number;`
      );

      res.status(200).json(rowResults.rows);
    } else {
      //if part is already in table then return
      res
        .status(200)
        .json("This part already exists at this location with this status!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
});

// change location and/or status of a part in part_quantity table
inventoryRouter.post("/moveLocation", async (req, res) => {
  let {
    internal_part_number,
    location_id,
    status_id,
    new_location_id,
    new_status_id,
    old_quantity,
    new_quantity,
    user_id,
  } = req.body;

  // the amount that is moved into the new location would be the amount of parts missing from the previous quantity
  // ex. old quantity was 20. quantity is now 9. 20 - 9 = 11. 11 is the amount that was moved
  let moveAmount = old_quantity - new_quantity;

  try {
    var new_location_name = await pool.query(`select location_name from locations where location_id=${new_location_id};`)
    var old_location_name = await pool.query(`select location_name from locations where location_id=${location_id};`)
    var new_status_name = await pool.query(`select status_name from statuses where status_id=${new_status_id};`)
    var old_status_name = await pool.query(`select status_name from statuses where status_id=${status_id};`) 
    
    //check if there is quantity available to be moved
    if (old_quantity - moveAmount < 0) {
      res
        .status(400)
        .json({ msg: "Trying to move more of an item than there actually is" });
    } else {
      // query that grabs the new location the items will be moved to
      let getNewLocationQuery = `SELECT * from part_quantity WHERE internal_part_number = '${internal_part_number}' AND status_id = ${new_status_id} AND location_id = ${new_location_id};`;

      const newLocation = await pool.query(getNewLocationQuery);
      let updateNewLocationQuery;

      // gets the updated quantity of the new location after moving items there
      if (newLocation.rows.length !== 0) {
        let newLocationQty = newLocation.rows[0].quantity + moveAmount;

        //query updates quantity of the part row with the new location and status
        updateNewLocationQuery = `UPDATE part_quantity SET quantity = ${newLocationQty} WHERE internal_part_number = '${internal_part_number}' AND status_id = ${new_status_id} AND location_id = ${new_location_id};`;
      }

      //query that updates quantity of the part row with the previous location and status
      let updatePrevLocationQuery = `UPDATE part_quantity SET quantity = ${new_quantity} WHERE internal_part_number = '${internal_part_number}' AND status_id = ${status_id} AND location_id = ${location_id};`;

      //query that creates a row for where the parts will be moved into if the row doesn't already exist
      let insertIntoNewLocationQuery = `INSERT into part_quantity values('${internal_part_number}', '${new_location_id}', '${new_status_id}', '${moveAmount}', '', DEFAULT)`;

      if (newLocation.rows.length === 0) {
        // updates the previous location and creates a row for the new location
        await pool.query(insertIntoNewLocationQuery);
        await pool.query(updatePrevLocationQuery);
      } else {
        //updates the new and previous location
        await pool.query(updatePrevLocationQuery);
        await pool.query(updateNewLocationQuery);
      }

      // Generates a log.
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      var hours = today.getHours();
      var minutes = today.getMinutes();
      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;

      today = mm + "/" + dd + "/" + yyyy + "/" + strTime;
      let loggingQuery = `insert into logs values( nextval('logs_log_id_seq'),${user_id},'${internal_part_number}',3,'${today}','','Relocated Part') returning log_id;`;
      let log_id = await pool.query(loggingQuery);
      let eventQuery = `insert into relocation_events values(${log_id.rows[0].log_id},3,${moveAmount},'${old_location_name.rows[0].location_name}','${new_location_name.rows[0].location_name}','${old_status_name.rows[0].status_name}','${new_status_name.rows[0].status_name}','${internal_part_number}');`;
      await pool.query(eventQuery);
      let rowResults = await pool.query(
        `SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.category_id = part_categories.part_category_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id order by internal_part_number;`
      );
      res.status(200).json(rowResults.rows);
    }
  } catch (e) {
    res.status(400).json("Bad request");
  }
});

// router for converting raw materials or wip parts into wip parts or finished goods
inventoryRouter.post("/convert", async (req, res) => {
  let array = [];
  let location_id = 0;
  let final_location_id = 0;
  let conversionQuantity = req.body.conversionQuantity;
  let internal_part_number = req.body.internal_part_number;
  let user_id = req.body.user_id;
  let ConvertPartsRouterQuery = `select * from wip where part_id = '${internal_part_number}';`;

  try {
    //get wip id and location id
    const wip_res = await pool.query(ConvertPartsRouterQuery);

    let wip_id = wip_res.rows[0].wip_id;
    location_id = wip_res.rows[0].location_id;
    final_location_id = wip_res.rows[0].final_location_id;

    //get formula
    let ConvertPartsRouterQuery2 = `select * from wip_parts where wip_id = ${wip_id};`;
    let wip_parts_res = await pool.query(ConvertPartsRouterQuery2);
    //store formula in array with IPN and quantity needed

    for (let i = 0; i < wip_parts_res.rows.length; i++) {
      array.push(wip_parts_res.rows[i]);
    }

    //check for wip in table
    let ConvertPartsRouterQuery15 = `select * from part_quantity where internal_part_number = '${internal_part_number}' and location_id = ${final_location_id} and status_id=2;`;
    const part_quantity_quantity2_res = await pool.query(
      ConvertPartsRouterQuery15
    );
    if (part_quantity_quantity2_res.rows.length === 0) {
      let rowResults = await pool.query(
        `SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.category_id = part_categories.part_category_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id order by internal_part_number;`
      );

      let result = { rows: rowResults.rows, convertPossible: false };
      return res.status(200).json(result);
    }

    //check
    for (let i = 0; i < wip_parts_res.rows.length; i++) {
      let ConvertPartsRouterQuery3 = `select * from part_quantity where internal_part_number = '${array[i].part_id}' and location_id = ${location_id} and status_id=2;`;

      const part_quantity_res = await pool.query(ConvertPartsRouterQuery3);

      if (part_quantity_res.rows.length === 0) {
        let rowResults = await pool.query(
          `SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.category_id = part_categories.part_category_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id order by internal_part_number;`
        );

        let result = { rows: rowResults.rows, convertPossible: false };
        return res.status(200).json(result);
      } else if (
        part_quantity_res.rows[0].quantity <
        array[i].wip_part_quantity_needed * conversionQuantity
      ) {
        let rowResults = await pool.query(
          `SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.category_id = part_categories.part_category_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id order by internal_part_number;`
        );

        let result = { rows: rowResults.rows, convertPossible: false };
        return res.status(200).json(result);
      }
    } //get quantity
    for (let i = 0; i < wip_parts_res.rows.length; i++) {
      let ConvertPartsRouterQuery4 = `select * from part_quantity where internal_part_number = '${array[i].part_id}' and location_id = ${location_id} and status_id=2;`;
      const part_quantity_quantity_res = await pool.query(
        ConvertPartsRouterQuery4
      );

      let quantity = part_quantity_quantity_res.rows[0].quantity;
      //update quantity
      let ConvertPartsRouterQuery5 = `update part_quantity set quantity=${
        quantity - array[i].wip_part_quantity_needed * conversionQuantity
      } where internal_part_number = '${
        array[i].part_id
      }' and location_id = ${location_id} and status_id=2;`;
      await pool.query(ConvertPartsRouterQuery5);
      //get total quantity
      let ConvertPartsRouterQuery6 = `select * from parts where internal_part_number = '${array[i].part_id}';`;

      const parts_total_quantity_res = await pool.query(
        ConvertPartsRouterQuery6
      );

      let total_quantity = parts_total_quantity_res.rows[0].total_quantity;

      //update total quantity
      let ConvertPartsRouterQuery7 = `update parts set total_quantity=${
        total_quantity - array[i].wip_part_quantity_needed * conversionQuantity
      } where internal_part_number = '${array[i].part_id}';`;
      await pool.query(ConvertPartsRouterQuery7);
    }

    //get quantity for wip
    let ConvertPartsRouterQuery4 = `select * from part_quantity where internal_part_number = '${internal_part_number}' and location_id = ${final_location_id} and status_id=2;`;
    const part_quantity_quantity_res = await pool.query(
      ConvertPartsRouterQuery4
    );
    let quantity = part_quantity_quantity_res.rows[0].quantity;
    //update quantity for wip
    let ConvertPartsRouterQuery13 = `update part_quantity set quantity=${
      quantity + 1 * conversionQuantity
    } where internal_part_number = '${internal_part_number}' and location_id = ${final_location_id} and status_id=2;`;

    await pool.query(ConvertPartsRouterQuery13);
    //get total quantity for wip
    let ConvertPartsRouterQuery6 = `select * from parts where internal_part_number = '${internal_part_number}';`;

    const parts_total_quantity_res = await pool.query(ConvertPartsRouterQuery6);
    let total_quantity = parts_total_quantity_res.rows[0].total_quantity;
    //update total quantity for wip
    let ConvertPartsRouterQuery7 = `update parts set total_quantity=${
      total_quantity + 1 * conversionQuantity
    } where internal_part_number = '${internal_part_number}';`;

    await pool.query(ConvertPartsRouterQuery7);

    // Generates a log.
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;

    today = mm + "/" + dd + "/" + yyyy + "/" + strTime;

    let loggingQuery = `insert into logs values( nextval('logs_log_id_seq'),${user_id},'${internal_part_number}', 2 ,'${today}','','Convert') returning log_id;`;
    let log_id = await pool.query(loggingQuery);

    let eventQuery = `insert into convert_events values(${log_id.rows[0].log_id},2,${conversionQuantity},1);`;
    await pool.query(eventQuery);

    let rowResults = await pool.query(
      `SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.category_id = part_categories.part_category_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id order by internal_part_number;`
    );

    let result = { rows: rowResults.rows, convertPossible: true };
    res.status(200).json(result);
  } catch (e) {
    res.status(400).send(e);
  }
});

// router for unconverting a wip part or an finished good into its base parts
inventoryRouter.post("/unconvert", async (req, res) => {
  let array = [];
  let location_id = 0;
  let final_location_id = 0;
  let conversionQuantity = req.body.conversionQuantity;
  let internal_part_number = req.body.internal_part_number;
  let user_id = req.body.user_id;

  let ConvertPartsRouterQuery = `select * from wip where part_id = '${internal_part_number}';`;

  try {
    //get wip id and location id
    const wip_res = await pool.query(ConvertPartsRouterQuery);

    let wip_id = wip_res.rows[0].wip_id;
    location_id = wip_res.rows[0].location_id;
    final_location_id = wip_res.rows[0].final_location_id;

    //get formula
    let ConvertPartsRouterQuery2 = `select * from wip_parts where wip_id = ${wip_id};`;
    let wip_parts_res = await pool.query(ConvertPartsRouterQuery2);
    //store formula in array with IPN and quantity needed

    for (let i = 0; i < wip_parts_res.rows.length; i++) {
      array.push(wip_parts_res.rows[i]);
    }

    //get quantity for wip
    let ConvertPartsRouterQuery4 = `select * from part_quantity where internal_part_number = '${internal_part_number}' and location_id = ${final_location_id} and status_id=2;`;
    const part_quantity_quantity_res = await pool.query(
      ConvertPartsRouterQuery4
    );
    if (part_quantity_quantity_res.rows.length === 0) {
      let rowResults = await pool.query(
        `SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.category_id = part_categories.part_category_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id order by internal_part_number;`
      );

      let result = { rows: rowResults.rows, unconvertPossible: false };
      return res.status(200).json(result);
    }
    let quantity = part_quantity_quantity_res.rows[0].quantity;
    //check to see if enough quantity to convert
    if (quantity - 1 * conversionQuantity < 0) {
      let rowResults = await pool.query(
        `SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.category_id = part_categories.part_category_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id order by internal_part_number;`
      );
      let result = { rows: rowResults.rows, unconvertPossible: false };
      return res.status(200).json(result);
    }

    //get total quantity for wip
    let ConvertPartsRouterQuery6 = `select * from parts where internal_part_number = '${internal_part_number}';`;

    const parts_total_quantity_res = await pool.query(ConvertPartsRouterQuery6);
    let total_quantity = parts_total_quantity_res.rows[0].total_quantity;

    //check
    for (let i = 0; i < wip_parts_res.rows.length; i++) {
      let ConvertPartsRouterQuery3 = `select * from part_quantity where internal_part_number = '${array[i].part_id}' and location_id = ${location_id} and status_id=2;`;

      const part_quantity_res = await pool.query(ConvertPartsRouterQuery3);

      if (part_quantity_res.rows.length === 0) {
        let addIntoPartQuantity = `insert into part_quantity values('${array[i].part_id}',${location_id},2,0,'');`;
        await pool.query(addIntoPartQuantity);
      }
    }

    for (let i = 0; i < wip_parts_res.rows.length; i++) {
      //get quantity
      let ConvertPartsRouterQuery4 = `select * from part_quantity where internal_part_number = '${array[i].part_id}' and location_id = ${location_id} and status_id=2;`;
      const part_quantity_quantity_res = await pool.query(
        ConvertPartsRouterQuery4
      );

      let quantity = part_quantity_quantity_res.rows[0].quantity;
      //update quantity
      let ConvertPartsRouterQuery5 = `update part_quantity set quantity=${
        quantity + array[i].wip_part_quantity_needed * conversionQuantity
      } where internal_part_number = '${
        array[i].part_id
      }' and location_id = ${location_id} and status_id=2;`;
      await pool.query(ConvertPartsRouterQuery5);
      //get total quantity
      let ConvertPartsRouterQuery6 = `select * from parts where internal_part_number = '${array[i].part_id}';`;

      const parts_total_quantity_res = await pool.query(
        ConvertPartsRouterQuery6
      );

      let total_quantity = parts_total_quantity_res.rows[0].total_quantity;

      //update total quantity
      let ConvertPartsRouterQuery7 = `update parts set total_quantity=${
        total_quantity + array[i].wip_part_quantity_needed * conversionQuantity
      } where internal_part_number = '${array[i].part_id}';`;
      await pool.query(ConvertPartsRouterQuery7);
    }
    //update quantity for wip
    let ConvertPartsRouterQuery13 = `update part_quantity set quantity=${
      quantity - 1 * conversionQuantity
    } where internal_part_number = '${internal_part_number}' and location_id = ${final_location_id} and status_id=2;`;

    await pool.query(ConvertPartsRouterQuery13);
    //update total quantity for wip
    let ConvertPartsRouterQuery7 = `update parts set total_quantity=${
      total_quantity - 1 * conversionQuantity
    } where internal_part_number = '${internal_part_number}';`;

    await pool.query(ConvertPartsRouterQuery7);

    // Generates a log.
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;

    today = mm + "/" + dd + "/" + yyyy + "/" + strTime;

    let loggingQuery = `insert into logs values( nextval('logs_log_id_seq'),${user_id},'${internal_part_number}', 2 ,'${today}','','Unconvert') returning log_id;`;
    let log_id = await pool.query(loggingQuery);

    let eventQuery = `insert into convert_events values(${log_id.rows[0].log_id},2,${conversionQuantity},0);`;
    await pool.query(eventQuery);

    let rowResults = await pool.query(
      `SELECT parts.internal_part_number, parts.part_name, locations.location_name, part_categories.part_category_name, statuses.status_name, part_quantity.quantity, part_quantity.serial, parts.total_quantity FROM parts INNER JOIN part_quantity ON parts.internal_part_number = part_quantity.internal_part_number INNER JOIN locations ON part_quantity.location_id = locations.location_id INNER JOIN part_categories ON parts.category_id = part_categories.part_category_id INNER JOIN statuses ON part_quantity.status_id = statuses.status_id order by internal_part_number;`
    );

    let result = { rows: rowResults.rows, unconvertPossible: true };
    return res.status(200).json(result);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = inventoryRouter;
