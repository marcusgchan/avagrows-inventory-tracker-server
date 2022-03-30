var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
var initQuantity1;
var quantity;
chai.use(chaiHttp);

describe("part_location_change", function () {
  it("should see if quantity is correct in both locations", function (done) {
    chai
      .request(server)
      .get("/api/testing/queryForLocationQuantityRouter")
      .end(function (err, res) {
        initQuantity1 = res.body;
        quantity = initQuantity1 - 1;

        chai
          .request(server)
          .get("/api/testing/queryForLogRouter")
          .end(function (err, res) {
            var numLogs = res.body.length;

            chai
              .request(server)
              .get("/api/testing/queryForEventLocationRouter")
              .end(function (err, res) {
                var numRelocationEvents = res.body.length;

                chai
                  .request(server)
                  .post("/api/inventory/moveLocation")
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
                      .get("/api/testing/queryForEventLocationRouter")
                      .end(function (err, res) {
                        var numRelocationEvents2 = res.body.length;

                        chai
                          .request(server)
                          .get("/api/testing/queryForLogRouter")
                          .end(function (err, res) {
                            var numLogs2 = res.body.length;
                            (numLogs2 - numLogs).should.equal(1);
                            (
                              numRelocationEvents2 - numRelocationEvents
                            ).should.equal(1);
                            done();
                          });
                      });
                  });
              });
          });
      });
  });
});
