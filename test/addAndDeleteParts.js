var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
chai.use(chaiHttp);

describe("parts_add_remove", function () {
  it("should see if part is added", function (done) {

       chai 
      .request(server)
      .get("/api/queryForGetPartsRouter")
      
      .end(function (err, res) {
        var num = res.body.length;
        console.log(num);
        chai
          .request(server)
          .post("/api/addPartsRouter")
          .send({
            internal_part_number: "testEntry",
            part_name: "test",
            manufacture_name:"test",
            manufacture_part_number: "test",
            item_description:"test",
            unit_price:"test",
            line_price:"test",
            lead_time:"test",
            total_quantity:10,
            category_id:1,
          })
          .end(function (error, res) {
            chai
              .request(server)
              .get("/api/queryForGetPartsRouter")
              .end(function (err, res) {
                var num2 = res.body.length;
                console.log(num2);
                (num2 - num).should.equal(1);
                done();
              });
            
          });
        
    
      });
  });

  it("should see if part is deleted from table",function(done){
    

    
    chai
    .request(server)
    .get("/api/queryForGetPartsRouter")
    .end(function (err, res) {
      var num = res.body.length;
      console.log(num);
      chai
        .request(server)
        .post("/api/deletePartsRouter")
        .send({
          internal_part_number: "testEntry",
          
          
        })
        .end(function (error, res) {
            console.log(res.body)
          chai
            .request(server)
            .get("/api/queryForGetPartsRouter")
            .end(function (err, res) {
              var num2 = res.body.length;
              console.log(num2);
              (num - num2).should.equal(1);
              
                    done();
                });
              
            });
          
        });
    

  });
});
