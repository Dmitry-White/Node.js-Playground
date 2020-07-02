const chai = require("chai");
const chaiHttp = require("chai-http");
const proxyquire = require("proxyquire");
const sinon = require("sinon");
const logger = require("morgan")("dev");

// eslint-disable-next-line
const should = chai.should();
chai.use(chaiHttp);

describe("/reservations", () => {
  let app;

  const debugStub = () => {
    return sinon.stub();
  };
  console.log(logger);
  const loggerStub = sinon.stub().returns(function (req, res, next) {
    next();
  });

  const dbStub = {
    run: () =>
      Promise.resolve({
        stmt: {
          lastID: 1349,
        },
      }),
  };

  before(() => {
    debugStub["@global"] = true;
    dbStub["@global"] = true;

    app = proxyquire("../../app", {
      sqlite: dbStub,
      morgan: loggerStub,
      debug: debugStub,
    });
  });

  context("GET", () => {
    it("should return the reservations form", async () => {
      const res = await chai.request(app).get("/reservations");

      res.should.have.status(200);
      res.text.should.contain(
        "To make reservations please fill out the following form"
      );
    });
  });

  context("POST", () => {
    it("should accept a valid reservation request", async () => {
      const res = await chai
        .request(app)
        .post("/reservations")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send({
          date: "2017/06/10",
          time: "06:02 AM",
          party: 4,
          name: "Family",
          email: "username@example.com",
        });

      res.should.have.status(200);
      res.text.should.contain(
        "Thanks, your booking request #1349 is waiting to be confirmed"
      );
    });

    it("should reject an invalid reservation request", async () => {
      const res = await chai
        .request(app)
        .post("/reservations")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send({
          date: "2017/06/10",
          time: "06:02 AM",
          party: "bananas",
          name: "Family",
          email: "username@example.com",
        });

      res.should.have.status(400);
      res.text.should.contain(
        "Sorry, there was a problem with your booking request"
      );
    });
  });
});
