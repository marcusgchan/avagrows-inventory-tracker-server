var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
chai.use(chaiHttp);
const conversionQuantity = 2;
describe("convert_parts", function () {
  it("should see if parts are converted and total quantity is changed", function (done) {

        
       
       chai 
      .request(server)
      .get("/api/queryForConversionQuantity")
      
      .end(function (err, res) {
        var num = res.body;
        for(var i=0;i<5;i++){
            console.log(num[i].quantity)
        }
        chai
        .request(server)
        .get("/api/queryForConversionTotalQuantity")
        .end(function(err,res){
            console.log("hi")
            var numTotal=res.body;
            chai
          .request(server)
          .post("/api/ConverPartsRouter")
          .send({
            conversionQuantity: conversionQuantity,
            internal_part_number:"BYTE",
          })
          .end(function (error, res) {
            chai
              .request(server)
              .get("/api/queryForConversionQuantity")
              .end(function (err, res) {
                var num2 = res.body;
                for(var i=0;i<5;i++){
                    console.log(num2[i].quantity);
                    if(num2[i].internal_part_number!="BYTE"){
                        (num[i].quantity - num2[i].quantity).should.equal(1*conversionQuantity);
                    } else{
                    (num2[i].quantity - num[i].quantity).should.equal(1*conversionQuantity);
                    }
                }
                chai
                .request(server)
                .get("/api/queryForConversionTotalQuantity")
                .end(function(err,res){
                    var numtotal2=res.body;

                    for(var i=0;i<5;i++){
                        if(num2[i].internal_part_number!="BYTE")
                            (numTotal[i].quantity - numTotal2[i].quantity).should.equal(1*conversionQuantity);
                        else
                        (numTotal2[i].quantity - numTotal[i].quantity).should.equal(1*conversionQuantity);
                    }
                    
                    done();
                })
                
                
              });
            
          });
        })
        
        
    
      });
  });
});
