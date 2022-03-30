var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
chai.use(chaiHttp);

describe("statuses_edit", function () {
  it("should see if statuses are editied", function (done) {
    chai
      .request(server)
      .post("/api/statuses/edit")
      .send({
        status_id: 10,
        log_id: 10,
        status_name: "test",
        note: "test",
        oldstatus_id: 3,
      })
      .end(function (error, res) {
        chai
          .request(server)
          .get("/api/testing/queryForEditStatusRouter")
          .end(function (err, res) {
            var num2 = res.body.length;
            console.log(num2);
            num2.should.equal(1);
            done();
          });
      });
  });
});
