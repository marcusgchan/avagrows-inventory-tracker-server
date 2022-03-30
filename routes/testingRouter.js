const testingRouter = require("express").Router();
const pool = require("../db");
const inventoryRouter = require("./inventoryRouter");

testingRouter.get("/queryForTestTotalQuantityRouter", (req, res) => {
  //select all parts from part quantity table
  var queryForTestQuantityQuery =
    "SELECT * FROM parts where internal_part_number = '2MP04';";

  pool.query(queryForTestQuantityQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).end;
    }
    var results = result.rows[0].total_quantity;
    res.json(results);
  });
});

testingRouter.get("/queryForPartsQuantityQuantityRouter", (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuantityQuery =
    "SELECT * FROM part_quantity where internal_part_number='2MP04' and location_id = 1 and status_id=1;";

  pool.query(queryPartsQuantityQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result.rows[0].quantity;
    res.json(results);
  });
});

testingRouter.get("/queryForLocationQuantityRouter", (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuantityQuery =
    "SELECT * FROM part_quantity where internal_part_number='LIGHTSTAND' and location_id = 1 and status_id=1;";

  pool.query(queryPartsQuantityQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result.rows[0].quantity;
    res.json(results);
  });
});

testingRouter.get("/queryForGetPartCategoryRouter", (req, res) => {
    //select all parts from part quantity table
    var queryPartsQuery = "SELECT * FROM part_categories";
  
    pool.query(queryPartsQuery, (error, result) => {
      if (error) {  
        console.log(error);
        res.status(200).end();
        
      }
      var results = result.rows;
      res.json(results);
      
    });
  });

testingRouter.get("/queryForLocationQuantity2Router", (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuantityQuery =
    "SELECT * FROM part_quantity where internal_part_number='LIGHTSTAND' and location_id = 2 and status_id=1;";

  pool.query(queryPartsQuantityQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result.rows[0].quantity;
    res.json(results);
  });
});

testingRouter.get("/queryForEditLocation", (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuery = "SELECT * FROM locations where location_id = 4";

  pool.query(queryPartsQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result.rows;
    res.json(results);
  });
});

testingRouter.get("/queryForEditPartCategoryRouter", (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuery =
    "SELECT * FROM part_categories where part_id = 'MTL0139'";

  pool.query(queryPartsQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result.rows;
    res.json(results);
  });
});

testingRouter.get("/queryForEditPartsRouter", (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuery =
    "SELECT * FROM parts where internal_part_number = 'test'";

  pool.query(queryPartsQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result.rows;
    res.json(results);
  });
});

testingRouter.get("/queryForEditStatusRouter", (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuery = "SELECT * from statuses where status_id = 10";

  pool.query(queryPartsQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result.rows;
    res.json(results);
  });
});

testingRouter.get("/queryForConversionQuantity", (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuery =
    "SELECT * FROM part_quantity where internal_part_number = 'BYTE'and location_id = 2 and status_id=2 or internal_part_number = 'LIGHTSTAND'and location_id = 2 and status_id=2 or internal_part_number = 'PUMPHOUSING' and location_id = 2 and status_id=2 or internal_part_number = 'WATERTANK' and location_id = 2 and status_id=2 or internal_part_number = 'PACKAGING' and location_id = 2 and status_id=2;";

  pool.query(queryPartsQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result.rows;
    res.json(results);
  });
});

testingRouter.get("/queryForConversionTotalQuantity", (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuery =
    "SELECT * FROM parts where internal_part_number = 'BYTE' or internal_part_number = 'LIGHTSTAND' or internal_part_number = 'PUMPHOUSING' or internal_part_number = 'WATERTANK' or internal_part_number = 'PACKAGING' ;";

  pool.query(queryPartsQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).end();
    }
    var results = result.rows;
    res.status(200).json(results);
  });
});

testingRouter.get("/queryForLogRouter", (req, res) => {
  //select all parts from part quantity table
  var queryForLogQuery = "SELECT * FROM logs;";

  pool.query(queryForLogQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result.rows;
    res.json(results);
  });
});

testingRouter.get("/queryForEventConvertRouter", (req, res) => {
  //select all parts from part quantity table
  var queryForEventConvertQuery = "SELECT * FROM convert_events;";

  pool.query(queryForEventConvertQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result.rows;
    res.json(results);
  });
});

testingRouter.get("/queryForAddEventRouter", (req, res) => {
  //select all parts from part quantity table
  var queryForAddEventQuery = "SELECT * FROM add_events;";

  pool.query(queryForAddEventQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result.rows;
    res.json(results);
  });
});

testingRouter.get("/queryForDeleteEventsRouter", (req, res) => {
  //select all parts from part quantity table
  var queryForDeleteEventsQuery = "SELECT * FROM delete_events;";

  pool.query(queryForDeleteEventsQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result.rows;
    res.json(results);
  });
});

testingRouter.get("/queryForEventLocationRouter", (req, res) => {
  //select all events from relocation events table.
  var queryForEventLocationQuery = "SELECT * FROM relocation_events;";

  pool.query(queryForEventLocationQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result.rows;
    res.json(results);
  });
});

testingRouter.get("/queryForEventQuantityRouter", (req, res) => {
  //select all events from relocation events table.
  var queryForEventQuantityQuery = "SELECT * FROM quantity_change_events;";

  pool.query(queryForEventQuantityQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result.rows;
    res.json(results);
  });
});

module.exports = testingRouter;
