var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
var initQuantity1;
var initQuantity2;
var finalQuantity1;
var finalQuantity2;
var quantity;
var moveAmount;
var totalQuantity2;
chai.use(chaiHttp);

describe("part_location_change", function () {
  it("should see if quantity is correct in both locations", function (done) {

        chai
        .request(server)
        .get("/api/queryForLocationQuantityRouter")
        .end(function(err,res){
            initQuantity1=res.body;
            quantity=initQuantity1-1;
            console.log(initQuantity1);
       
       chai 
      .request(server)
      .get("/api/queryForLocationQuantity2Router")
      .end(function (err, res) {
        var initQuantity2 = res.body;
        console.log(initQuantity2);
        chai
          .request(server)
          .post("/api/moveLocation")
          .send({
            internal_part_number: "LIGHTSTAND",
            location_id: 1,
            status_id: 1,
            new_location_id: 2,
            new_status_id: 1,
            old_quantity: initQuantity1,
            new_quantity: quantity,
          })
          .end(function (error, res) {
            chai
            .request(server)
            .get("/api/queryForLocationQuantityRouter")
            .end(function(err,res){
            finalQuantity1=res.body;
            console.log(finalQuantity1);
       
                chai 
                .request(server)
                .get("/api/queryForLocationQuantity2Router")
                .end(function (err, res) {
                var finalQuantity2 = res.body;
                moveAmount=initQuantity1-quantity;
                console.log(finalQuantity2);
                (moveAmount).should.equal(initQuantity1-finalQuantity1);  
                (initQuantity2+moveAmount).should.equal(finalQuantity2); 
                done(); 
                        });
                    });
                });
            });
        });

    });
});