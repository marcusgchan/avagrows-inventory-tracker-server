var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
chai.use(chaiHttp);
const conversionQuantity = 2;

describe("unconvert_parts", function () {
  it("should see if parts are unconverted and total quantity is changed", function (done) {
    chai
      .request(server)
      .get("/api/testing/queryForConversionQuantity")
      .end(function (err, res) {
        var num = res.body;
        chai
          .request(server)
          .get("/api/testing/queryForConversionTotalQuantity")
          .end(function (err, res) {
            console.log("hi");
            var numTotal = res.body;
            chai
              .request(server)
              .post("/api/inventory/unconvert")
              .send({
                conversionQuantity: conversionQuantity,
                internal_part_number: "BYTE",
                user_id: 1,
              })
              .end(function (error, res) {
                res.body.unconvertPossible.should.equal(true);
                chai
                  .request(server)
                  .get("/api/testing/queryForConversionQuantity")
                  .end(function (err, res) {
                    var num2 = res.body;
                    for (var i = 0; i < 5; i++) {
                      if (num2[i].internal_part_number == "BYTE") {
                        (num[i].quantity - num2[i].quantity).should.equal(
                          1 * conversionQuantity
                        );
                      } else {
                        (num2[i].quantity - num[i].quantity).should.equal(
                          1 * conversionQuantity
                        );
                      }
                    }
                    chai
                      .request(server)
                      .get("/api/testing/queryForConversionTotalQuantity")
                      .end(function (err, res) {
                        var numTotal2 = res.body;
                        //console.log(numTotal);
                        //console.log("-------------");
                        //console.log(numTotal2);
                        for (var i = 0; i < 5; i++) {
                          if (num2[i].internal_part_number == "BYTE")
                            (
                              numTotal[i].total_quantity -
                              numTotal2[i].total_quantity
                            ).should.equal(1 * conversionQuantity);
                          else{
                            (
                              numTotal2[i].total_quantity -
                              numTotal[i].total_quantity
                            ).should.equal(1 * conversionQuantity);
                          }
                        }
                        done();
                      });
                  });
              });
          });
      });
  });
});
