var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
chai.use(chaiHttp);

describe("statuses_edit", function () {
  it("should see if statuses are editied", function (done) {

    chai
      .request(server)
      .get("/api/testing/queryForStatusesID")
      .end(function (err, res) {
        var status_id=res.body;
        chai
          .request(server)
          .post("/api/statuses/edit")
          .send({
            status_id: status_id,

            status_name: "test",
            note: "test",

          })
          .end(function (error, res) {
            chai
              .request(server)
              .get("/api/testing/queryForEditStatusRouter")
              .end(function (err, res) {
                var num2 = res.body.rows[0].status_name;
                console.log(num2);
                num2.should.equal("test");
                done();
              });
          });
      });
    });
  });
