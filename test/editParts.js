var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
chai.use(chaiHttp);

describe("parts_edit", function () {
  it("should see if parts are editied", function (done) {
    chai
      .request(server)
      .post("/api/editPartsRouter")
      .send({
        internal_part_number: "test",
        old_internal_part_number: "MTL0148",
        part_name: "test",
        manufacture_name: "test",
        manufacture_part_number: "test",
        item_description: "test",
        unit_price: "test",
        line_price: "test",
        lead_time: "test",
        total_quantity: 100,
        category_id: 1,
      })
      .end(function (error, res) {
        chai
          .request(server)
          .get("/api/queryForEditPartsRouter")
          .end(function (err, res) {
            var num2 = res.body.length;
            console.log(num2);
            (num2).should.equal(1);
            chai
              .request(server)
              .post("/api/editPartsRouter")
              .send({
                internal_part_number: "MTL0148",
                old_internal_part_number: "test",
                part_name: "Metals",
                manufacture_name: "Mr.Song",
                manufacture_part_number: "MTL0148",
                item_description: "gas spring rod extension",
                unit_price: "$0.92",
                line_price: "0.92",
                lead_time: "11",
                total_quantity: 100,
                category_id: 1,
              })
              .end(function (error, res) {
                done();
              })
          });
      });
  });
});
