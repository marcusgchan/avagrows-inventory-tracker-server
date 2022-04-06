var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
var should = chai.should();
chai.use(chaiHttp);

describe("parts_edit", function () {
  it("should see if parts are editied", function (done) {
    chai
      .request(server)
      .post("/api/parts/edit")
      .send({
        
        internal_part_number: "MTL0148",
        part_name: "test",
        part_category_name: "Raw Material",
        part_description: "test",
        unit_price: "test",
        line_price: "test",
        lead_time: "test",
        
      })
      .end(function (error, res) {
        chai
          .request(server)
          .get("/api/testing/queryForEditPartsRouter")
          .end(function (err, res) {
            var num2 = res.body.rows[0].part_name;
            console.log(num2);
            num2.should.equal("test");
            chai
              .request(server)
              .post("/api/parts/edit")
              .send({
                internal_part_number: "MTL0148",
                part_name: "Metals",
                part_description: "gas spring rod extension",
                unit_price: "$0.92",
                line_price: "0.92",
                lead_time: "11",
                
              
              })
              .end(function (error, res) {
                done();
              });
          });
      });
  });
});
