const testingRouter = require("express").Router();
const pool = require("../db");
const inventoryRouter = require("./inventoryRouter");
const authenticate = require("../authenticate");

testingRouter.get(
  "/queryForTestTotalQuantityRouter",
  authenticate,
  (req, res) => {
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
  }
);

testingRouter.get(
  "/queryForPartsQuantityQuantityRouter",
  authenticate,
  (req, res) => {
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
  }
);

testingRouter.get(
  "/queryForLocationQuantityRouter",
  authenticate,
  (req, res) => {
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
  }
);

testingRouter.get(
  "/queryForGetPartCategoryRouter",
  authenticate,
  (req, res) => {
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
  }
);

testingRouter.get(
  "/queryForLocationQuantity2Router",
  authenticate,
  (req, res) => {
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
  }
);

testingRouter.get("/queryForEditLocation", authenticate, (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuery =
    "SELECT * FROM locations where location_id = (select max(location_id) from locations);";

  pool.query(queryPartsQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result;
    res.json(results);
  });
});

testingRouter.get(
  "/queryForEditPartCategoryRouter",
  authenticate,
  (req, res) => {
    //select all parts from part quantity table
    var queryPartsQuery =
      "SELECT * FROM part_categories where part_category_id = (select max(part_category_id) from part_categories);";

    pool.query(queryPartsQuery, (error, result) => {
      if (error) {
        console.log(error);
        res.status(200).end();
      }
      var results = result;
      res.json(results);
    });
  }
);

testingRouter.get("/queryForEditPartsRouter", authenticate, (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuery =
    "SELECT * FROM parts where internal_part_number = 'MTL0148'";

  pool.query(queryPartsQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result;
    res.json(results);
  });
});

testingRouter.get("/queryForEditStatusRouter", authenticate, (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuery =
    "SELECT * FROM statuses where status_id = (select max(status_id) from statuses);";

  pool.query(queryPartsQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result;
    res.json(results);
  });
});

testingRouter.get("/queryForConversionQuantity", authenticate, (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuery =
    "SELECT * FROM part_quantity where internal_part_number = 'BYTE'and location_id = 2 and status_id=2 or internal_part_number = 'LIGHTSTAND'and location_id = 2 and status_id=2 or internal_part_number = 'PUMPHOUSING' and location_id = 2 and status_id=2 or internal_part_number = 'WATERTANK' and location_id = 2 and status_id=2 or internal_part_number = 'PACKAGING' and location_id = 2 and status_id=2 order by internal_part_number;";

  pool.query(queryPartsQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result.rows;
    res.json(results);
  });
});

testingRouter.get(
  "/queryForConversionTotalQuantity",
  authenticate,
  (req, res) => {
    //select all parts from part quantity table
    var queryPartsQuery =
      "SELECT * FROM parts where internal_part_number = 'BYTE' or internal_part_number = 'LIGHTSTAND' or internal_part_number = 'PUMPHOUSING' or internal_part_number = 'WATERTANK' or internal_part_number = 'PACKAGING' order by internal_part_number;";

    pool.query(queryPartsQuery, (error, result) => {
      if (error) {
        console.log(error);
        res.status(400).end();
      }
      var results = result.rows;
      res.status(200).json(results);
    });
  }
);

testingRouter.get("/queryForLogRouter", authenticate, (req, res) => {
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

testingRouter.get("/queryForEventConvertRouter", authenticate, (req, res) => {
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

testingRouter.get("/queryForAddEventRouter", authenticate, (req, res) => {
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

testingRouter.get("/queryForDeleteEventsRouter", authenticate, (req, res) => {
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

testingRouter.get("/queryForEventLocationRouter", authenticate, (req, res) => {
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

testingRouter.get("/queryForEventQuantityRouter", authenticate, (req, res) => {
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

testingRouter.get("/queryForLocationsID", authenticate, (req, res) => {
  //select all events from relocation events table.
  var queryForEventQuantityQuery = "select max(location_id) from locations;";

  pool.query(queryForEventQuantityQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result.rows[0].max;
    res.json(results);
  });
});

testingRouter.get("/queryForStatusesID", authenticate, (req, res) => {
  //select all events from relocation events table.
  var queryForEventQuantityQuery = "select max(status_id) from statuses;";

  pool.query(queryForEventQuantityQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result.rows[0].max;
    res.json(results);
  });
});

testingRouter.get("/queryPartsQuantityRouter", authenticate, (req, res) => {
  //select all parts from part quantity table
  var queryPartsQuantityQuery = "SELECT * FROM part_quantity;";

  pool.query(queryPartsQuantityQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result.rows;
    res.json(results);
  });
});
testingRouter.get("/queryForCategoryID", authenticate, (req, res) => {
  //select all events from relocation events table.
  var queryForEventQuantityQuery =
    "select max(part_category_id) from part_categories;";

  pool.query(queryForEventQuantityQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(200).end();
    }
    var results = result.rows[0].max;
    res.json(results);
  });
});

module.exports = testingRouter;
