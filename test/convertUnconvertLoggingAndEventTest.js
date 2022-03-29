var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
chai.use(chaiHttp);
const conversionQuantity = 2;
describe("convert_unconvert_Logging_Events", function () {
  it("should see if logs and event is created when convert post request is initiated", function (done) {

        
       
       chai 
      .request(server)
      .get("/api/queryForLogRouter")
      
      .end(function (err, res) {
        var logNumber = res.body.length;
        chai
        .request(server)
        .get("/api/queryForEventConvertRouter")
        .end(function(err,res){
            
            var eventNumber=res.body.length;
            chai
          .request(server)
          .post("/api/Convert")
          .send({
            conversionQuantity: conversionQuantity,
            internal_part_number:"BYTE",
          })
          .end(function (error, res) {
            
            chai
              .request(server)
              .get("/api/queryForLogRouter")
              .end(function (err, res) {
                var logNumberFinal = res.body.length;
                chai
                .request(server)
                .get("/api/queryForEventConvertRouter")
                .end(function(err,res){
                    var eventNumberFinal=res.body.length;
                    
                    (logNumber).should.equal(logNumberFinal-1);
                    (eventNumber).should.equal(eventNumberFinal-1);
                    done();
                    
                })
                
                
              });
            
          });
        })
        
        
    
      });
  });
  it("should see if logs and event is created when unconvert post request is initiated", function (done) {

        
       
    chai 
   .request(server)
   .get("/api/queryForLogRouter")
   
   .end(function (err, res) {
     var logNumber = res.body.length;
     chai
     .request(server)
     .get("/api/queryForEventConvertRouter")
     .end(function(err,res){
         
         var eventNumber=res.body.length;
         chai
       .request(server)
       .post("/api/unconvert")
       .send({
         conversionQuantity: conversionQuantity,
         internal_part_number:"BYTE",
       })
       .end(function (error, res) {
         
         chai
           .request(server)
           .get("/api/queryForLogRouter")
           .end(function (err, res) {
             var logNumberFinal = res.body.length;
             chai
             .request(server)
             .get("/api/queryForEventConvertRouter")
             .end(function(err,res){
                 var eventNumberFinal=res.body.length;
                 (logNumber).should.equal(logNumberFinal-1);
                 (eventNumber).should.equal(eventNumberFinal-1);
                 
                 
                 done();
             })
             
             
           });
         
       });
     })
     
     
 
   });
});
});
