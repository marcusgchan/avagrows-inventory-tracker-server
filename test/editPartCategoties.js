var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
chai.use(chaiHttp);

describe("part_categories_edit", function () {
  it("should see if part_categories are editied", function (done) {
    chai
      .request(server)
      .post("/api/categories/edit")
      .send({
        new_part_category_id: 4,
        part_id: "MTL0139",
        part_category_name: "test",
      })
      .end(function (error, res) {
        chai
          .request(server)
          .get("/api/testing/queryForEditPartCategoryRouter")
          .end(function (err, res) {
            var num2 = res.body.length;
            console.log(num2);
            num2.should.equal(1);
            done();
          });
      });
  });
});
