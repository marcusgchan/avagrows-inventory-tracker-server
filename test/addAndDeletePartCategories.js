var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
chai.use(chaiHttp);

describe("part_catagories_add_remove", function () {
  it("should see if part is added", function (done) {
    chai
      .request(server)
      .get("/api/testing/queryForGetPartCategoryRouter")
      .end(function (err, res) {
        var num = res.body.length;
        console.log(num);

        chai
          .request(server)
          .post("/api/categories/add")
          .send({
            part_id: "test",
            part_category_name: "raw material",
          })
          .end(function (error, res) {
            chai
              .request(server)
              .get("/api/testing/queryForGetPartCategoryRouter")
              .end(function (err, res) {
                var num2 = res.body.length;
                console.log(num2);
                (num2 - num).should.equal(1);
                done();
              });
          });
      });
  });

  it("should see if category is deleted from table", function (done) {
    chai
      .request(server)
      .get("/api/testing/queryForGetPartCategoryRouter")
      .end(function (err, res) {
        var num = res.body.length;
        console.log(num);

        chai
          .request(server)
          .post("/api/categories/delete")
          .send({
            part_id: "test",
            
          })
          .end(function (error, res) {
            console.log(res.body);

            chai
              .request(server)
              .get("/api/testing/queryForGetPartCategoryRouter")
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
