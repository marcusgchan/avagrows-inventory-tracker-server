var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
chai.use(chaiHttp);

describe("location_edit", function () {
  it("should see if location is edited", function (done) {
    chai
      .request(server)
      .get("/api/testing/queryForLocationsID")
      .end(function (error, res) {
        var location_id=res.body
    chai
      .request(server)
      .post("/api/locations/edit")
      .send({
        location_id: location_id,
        location_name: "test",
        address: "test",
        postal_code: "test",
      })
      .end(function (error, res) {
        chai
          .request(server)
          .get("/api/testing/queryForEditLocation")
          .end(function (err, res) {
            var num2 = res.body.rows[0].location_name;
            console.log(num2);
            num2.should.equal("test");
            done();
          });
      });
    });
  });
});
