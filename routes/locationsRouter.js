const locationRouter = require("express").Router();
const pool = require("../db");

locationRouter.get("/", (req, res) => {
    var locationTableQuery = "SELECT * FROM locations;";
    
    pool.query(locationTableQuery,(error,result)=> {
      if(error){
          
          console.log(error);
          return;
          
      }
      var results = {'rows':result.rows}
      res.json(results.rows)
    })
});

module.exports = locationRouter;
