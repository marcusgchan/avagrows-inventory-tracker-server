var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
var totalQuantity;
var quantity = 5;

chai.use(chaiHttp);

describe("add_delete_logging_events", function () {
  it("should see if log and event is created for add post request", function (done) {
    chai
      .request(server)
      .get("/api/testing/queryForTestTotalQuantityRouter")
      .end(function (err, res) {
        totalQuantity = res.body;
        console.log(totalQuantity);

        chai //get request for logs table size
          .request(server)
          .get("/api/testing/queryForLogRouter")

          .end(function (err, res) {
            var logNum = res.body.length;
            console.log(logNum);
            chai
              .request(server)
              .get("/api/testing/queryForAddEventRouter")

              .end(function (err, res) {
                var eventNum = res.body.length;
                console.log(eventNum);

                chai
                  .request(server)
                  .post("/api/inventory/addParts")
                  .send({
                    internal_part_number: "2MP04",
                    location_id: 1,
                    status_id: 5,
                    quantity: quantity,
                    note: "",
                    total_quantity: totalQuantity,
                    user_id: 1,
                  })
                  .end(function (error, res) {
                    chai
                      .request(server)
                      .get("/api/testing/queryForLogRouter")
                      .end(function (err, res) {
                        var logNum2 = res.body.length;
                        console.log(logNum2);
                        chai
                          .request(server)
                          .get("/api/testing/queryForAddEventRouter")
                          .end(function (err, res) {
                            var eventNum2 = res.body.length;
                            console.log(eventNum2);
                            (logNum2 - logNum).should.equal(1);
                            (eventNum2 - eventNum).should.equal(1);
                            done();
                          });
                      });
                  });
              });
          });
      });
  });

  it("should see if log and event is created for delete post request", function (done) {
    chai
      .request(server)
      .get("/api/testing/queryForLogRouter")
      .end(function (err, res) {
        logNum = res.body.length;
        console.log(logNum);

        chai
          .request(server)
          .get("/api/testing/queryForDeleteEventsRouter")
          .end(function (err, res) {
            var eventNum = res.body.length;
            console.log(eventNum);
            chai
              .request(server)
              .post("/api/inventory/delete")
              .send({
                internal_part_number: "2MP04",
                location_id: 1,
                status_id: 5,
                user_id:1,
              })
              .end(function (error, res) {
                chai
                  .request(server)
                  .get("/api/testing/queryForLogRouter")
                  .end(function (err, res) {
                    var logNum2 = res.body.length;
                    console.log(logNum2);
                    chai
                      .request(server)
                      .get("/api/testing/queryForDeleteEventsRouter")
                      .end(function (err, res) {
                        eventNum2 = res.body.length;
                        console.log(eventNum2);
                        (logNum2 - logNum).should.equal(1);
                        (eventNum2 - eventNum).should.equal(1);
                        done();
                      });
                  });
              });
          });
      });
  });
});
