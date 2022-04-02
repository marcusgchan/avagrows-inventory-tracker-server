var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
var totalQuantity;
var quantity = 30;
chai.use(chaiHttp);

describe("part_quantity_change_log", function () {
  it("should see if the log for change quantity is added to both the log and quantity event tables", function (done) {
    chai
      .request(server)
      .get("/api/testing/queryForTestTotalQuantityRouter")
      .end(function (err, res) {
        totalQuantity = res.body;
        console.log(totalQuantity);

        chai //get request for total quantity
          .request(server)
          .get("/api/testing/queryForPartsQuantityQuantityRouter")
          .end(function (err, res) {
            var oldQuantity = res.body;
            console.log(oldQuantity);

            chai
              .request(server)
              .get("/api/testing/queryForLogRouter")
              .end(function (err, res) {
                var numLogs = res.body.length;
                chai
                  .request(server)
                  .get("/api/testing/queryForEventQuantityRouter")
                  .end(function (err, res) {
                    var numQuantityEvents = res.body.length;

                    chai
                      .request(server)
                      .post("/api/inventory/changeQuantity")
                      .send({
                        old_quantity: oldQuantity,
                        new_quantity: quantity,
                        total_quantity: totalQuantity,
                        internal_part_number: "2MP04",
                        location_id: 1,
                        status_id: 1,
                        user_id:1,
                      })
                      .end(function (error, res) {
                        chai
                          .request(server)
                          .get("/api/testing/queryForLogRouter")
                          .end(function (err, res) {
                            var numLogs2 = res.body.length;
                            chai
                              .request(server)
                              .get("/api/testing/queryForEventQuantityRouter")
                              .end(function (err, res) {
                                var numQuantityEvents2 = res.body.length;
                                (numLogs2 - numLogs).should.equal(1);
                                (numQuantityEvents2 - numQuantityEvents).should.equal(1);
                                done();
                              });
                          });
                      });
                  });
              });
          });
      });
  });
});
