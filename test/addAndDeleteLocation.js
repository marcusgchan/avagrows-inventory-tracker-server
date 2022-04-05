var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
chai.use(chaiHttp);

describe("location_add_remove", function () {
  it("should see if location is added and total quantity is changed", function (done) {
    chai
      .request(server)
      .get("/api/locations/")
      .end(function (err, res) {
        var num = res.body.length;
        console.log(num);

        chai
          .request(server)
          .post("/api/locations/add")
          .send({
            location_name: "test2",
            address: "test",
            postal_code: "test",
          })
          .end(function (error, res) {
            chai
              .request(server)
              .get("/api/locations/")
              .end(function (err, res) {
                var num2 = res.body.length;
                console.log(num2);
                (num2 - num).should.equal(1);
                done();
              });
          });
      });
  });

  it("should see if part is deleted from table", function (done) {
    chai
      .request(server)
      .get("/api/locations/")
      .end(function (err, res) {
        var num = res.body.length;
        console.log(num);
        chai
          .request(server)
          .get("/api/testing/queryForLocationsID")
          .end(function (err, res) {
            var location_id = res.body;
            chai
              .request(server)
              .post("/api/locations/delete")
              .send({
                location_id: location_id,
              })
              .end(function (error, res) {
                chai
                  .request(server)
                  .get("/api/locations/")
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
  });
