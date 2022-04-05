var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
chai.use(chaiHttp);

describe("part_categories_edit", function () {
  it("should see if part_categories are editied", function (done) {
    chai
      .request(server)
      .get("/api/testing/queryForCategoryID")
      .end(function (error, res) {
        var category_id=res.body
    chai
      .request(server)
      .post("/api/categories/edit")
      .send({
        part_category_id: category_id,
        part_category_name: "testName2",
      })
      .end(function (error, res) {
        chai
          .request(server)
          .get("/api/testing/queryForEditPartCategoryRouter")
          .end(function (err, res) {
            var num2 = res.body.rows[0].part_category_name;
            console.log(num2);
            num2.should.equal("testName2");
            done();
          });
      });
  });
});
});
