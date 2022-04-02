var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
var totalQuantity;
var quantity = 30;
var totalQuantity2;
chai.use(chaiHttp);

describe("part_quantity_change", function () {
  it("should see if quantity and total quantity get changed", function (done) {

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
                  .get("/api/testing/queryForPartsQuantityQuantityRouter")
                  .end(function (err, res) {
                    var newQuantity = res.body;
                    console.log(newQuantity);
                    (newQuantity).should.equal(quantity);
                    chai
                      .request(server)
                      .get("/api/testing/queryForTestTotalQuantityRouter")
                      .end(function (err, res) {
                        totalQuantity2 = res.body;

                        (totalQuantity - oldQuantity + quantity).should.equal(totalQuantity2);
                        done();
                      });
                  });
              });
          });
      });
  });
});
