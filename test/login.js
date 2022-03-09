require("dotenv").config();
const request = require("supertest");
const app = require("../index");

describe("Login with correct credentials", () => {
  it("responds with user object", (done) => {
    request(app)
      .post("/api/login")
      .set("Accept", "application/json")
      .send({
        username: process.env.LOGIN_USERNAME,
        password: process.env.LOGIN_PASSWORD,
      })
      .expect(200, done);
  });
});

describe("Login with incorrect credentials", () => {
  it("empty username", (done) => {
    request(app)
      .post("/api/login")
      .set("Accept", "application/json")
      .send({
        username: "",
        password: "randompassword",
      })
      .expect(400, done);
  });
  it("empty password", (done) => {
    request(app)
      .post("/api/login")
      .set("Accept", "application/json")
      .send({
        username: "asdfasf",
        password: "",
      })
      .expect(400, done);
  });
  it("empty username and password", (done) => {
    request(app)
      .post("/api/login")
      .set("Accept", "application/json")
      .send({
        username: "",
        password: "",
      })
      .expect(400, done);
  });
  it("empty object", (done) => {
    request(app)
      .post("/api/login")
      .set("Accept", "application/json")
      .send({})
      .expect(400, done);
  });
  it("incorrect username", (done) => {
    request(app)
      .post("/api/login")
      .set("Accept", "application/json")
      .send({
        username: "asdfasf",
        password: process.env.LOGIN_PASSWORD,
      })
      .expect(401, done);
  });
  it("incorrect password", (done) => {
    request(app)
      .post("/api/login")
      .set("Accept", "application/json")
      .send({
        username: process.env.LOGIN_USERNAME,
        password: "random password",
      })
      .expect(401, done);
  });
});
