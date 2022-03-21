var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
chai.use(chaiHttp);

describe("statuses_add_remove", function () {
  it("should see if status is added", function (done) {

        
       
       chai 
      .request(server)
      .get("/api/queryForGetStatusRoute")
      
      .end(function (err, res) {
        var num = res.body.length;
        console.log(num);
        chai
          .request(server)
          .post("/api/addStatusRouter")
          .send({
            status_id:10,
            log_id:10,
            status_name:"test",
            note:"test",
          })
          .end(function (error, res) {
            chai
              .request(server)
              .get("/api/queryForGetStatusRoute")
              .end(function (err, res) {
                var num2 = res.body.length;
                console.log(num2);
                (num2 - num).should.equal(1);
                done();
              });
            
          });
        
    
      });
  });

  it("should see if status is deleted from table",function(done){
    

    
    chai
    .request(server)
    .get("/api/queryForGetStatusRoute")
    .end(function (err, res) {
      var num = res.body.length;
      console.log(num);
      chai
        .request(server)
        .post("/api/deleteStatusRouter")
        .send({
          status_id: 10,
          
          
        })
        .end(function (error, res) {
          chai
            .request(server)
            .get("/api/queryForGetStatusRoute")
            .end(function (err, res) {
              var num2 = res.body.length;
              console.log(num2);
              (num - num2).should.equal(1);
              
                    done();
                });
              
            });
          
        });
    

  })
});