var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
var totalQuantity;
var quantity = 5;
var totalQuantity2;
chai.use(chaiHttp);

describe("part_quantity", function () {
  it("should see if part is added and total quantity is changed", function (done) {

        chai
        .request(server)
        .get("/api/queryForTestTotalQuantityRouter")
        .end(function(err,res){
            totalQuantity=res.body;
            console.log(totalQuantity);
       
       chai //get request for total quantity
      .request(server)
      .get("/api/queryPartsQuantityRouter")
      
      .end(function (err, res) {
        var num = res.body.length;
        console.log(num);
        chai
          .request(server)
          .post("/api/addPart")
          .send({
            internal_part_number: "2MP04",
            location_id: 1,
            status_id: 5,
            quantity: quantity,
            note: "",
            total_quantity: totalQuantity,
          })
          .end(function (error, res) {
            chai
              .request(server)
              .get("/api/queryPartsQuantityRouter")
              .end(function (err, res) {
                var num2 = res.body.length;
                console.log(num2);
                (num2 - num).should.equal(1);
                chai
                .request(server)
                .get("/api/queryForTestTotalQuantityRouter")
                .end(function(err,res){
                    totalQuantity2=res.body;
                    
                    (totalQuantity+quantity).should.equal(totalQuantity2);
                    done();
                });
              });
            
          });
        });
    
      });
  });

  it("should see if part is deleted from table",function(done){
    
    chai
        .request(server)
        .get("/api/queryForTestTotalQuantityRouter")
        .end(function(err,res){
            totalQuantity=res.body;
            console.log(totalQuantity);
    
    chai
    .request(server)
    .get("/api/queryPartsQuantityRouter")
    .end(function (err, res) {
      var num = res.body.length;
      console.log(num);
      chai
        .request(server)
        .post("/api/delete")
        .send({
          internal_part_number: "2MP04",
          location_id: 1,
          status_id: 5,
          
        })
        .end(function (error, res) {
          chai
            .request(server)
            .get("/api/queryPartsQuantityRouter")
            .end(function (err, res) {
              var num2 = res.body.length;
              console.log(num2);
              (num - num2).should.equal(1);
              chai
                .request(server)
                .get("/api/queryForTestTotalQuantityRouter")
                .end(function(err,res){
                    totalQuantity2=res.body;
                    
                    (totalQuantity-quantity).should.equal(totalQuantity2);
                    done();
                });
              
            });
          
        });
    });
})
  })
});
