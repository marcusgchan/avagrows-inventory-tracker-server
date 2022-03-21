var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
chai.use(chaiHttp);

describe("location_edit", function () {
  it("should see if location is edited", function (done) {

        
       
       
        chai
          .request(server)
          .post("/api/editLocationRouter")
          .send({
              
            old_location_id:3,
            new_location_id:4,
            log_id: 10,
            location_name:"test",
            address:"test",
            postal_code:"test",
          })
          .end(function (error, res) {
            chai
              .request(server)
              .get("/api/queryForEditLocation")
              .end(function (err, res) {
                var num2 = res.body.length;
                console.log(num2);
                (num2).should.equal(1);
                done();
              });
            
          });
        
    
      });
  


});
