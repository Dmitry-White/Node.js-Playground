const chai = require("chai");
const proxyquire = require("proxyquire");
const sinon = require("sinon");
const db = require("sqlite");
const sinonChai = require("sinon-chai");

const Reservation = require("../../../lib/schema/reservation");

// eslint-disable-next-line
const should = chai.should();
chai.use(sinonChai);

describe("Reservations Lib", () => {
  let reservations;

  const debugStub = () => {
    return sinon.stub();
  };

  before(() => {
    reservations = proxyquire("../../../lib/reservations", {
      debug: debugStub,
    });
  });

  context("Validate", () => {
    it("should resolve with no optional fields, Promises", () => {
      const reservation = new Reservation({
        date: "2017/06/10",
        time: "06:02 AM",
        party: 4,
        name: "Family",
        email: "username@example.com",
      });

      return reservations
        .validate(reservation)
        .then((value) => value.should.deep.equal(reservation));
    });

    it("should reject with an invalid email, Promises", () => {
      const reservation = new Reservation({
        date: "2017/06/10",
        time: "06:02 AM",
        party: 4,
        name: "Family",
        email: "username",
      });

      return reservations
        .validate(reservation)
        .catch((error) => error.should.be.an("error").and.not.be.null);
    });

    it("should resolve with no optional fields, Async/Await", async () => {
      const reservation = new Reservation({
        date: "2017/06/10",
        time: "06:02 AM",
        party: 4,
        name: "Family",
        email: "username@example.com",
      });

      const value = await reservations.validate(reservation);

      value.should.deep.equal(reservation);
    });

    it("should reject with an invalid email, Async/Await", async () => {
      const reservation = new Reservation({
        date: "2017/06/10",
        time: "06:02 AM",
        party: 4,
        name: "Family",
        email: "username",
      });

      try {
        await reservations.validate(reservation);
      } catch (error) {
        error.should.be.an("error").and.not.be.null;
      }
    });
  });

  context("Create", () => {
    const dbStub = sinon.stub(db, "run").resolves({
      stmt: {
        lastID: 1349,
      },
    });

    before(() => {
      reservations = proxyquire("../../../lib/reservations", {
        debug: debugStub,
        sqlite: dbStub,
      });
    });

    after(() => {
      dbStub.restore();
    });

    it("should return the created reservation ID", async () => {
      const reservation = new Reservation({
        date: "2017/06/10",
        time: "06:02 AM",
        party: 4,
        name: "Family",
        email: "username@example.com",
      });

      const value = await reservations.create(reservation);

      value.should.deep.equal(1349);
    });

    it("should call the validator with a transformed reservation once", async () => {
      const reservation = new Reservation({
        date: "2017/06/10",
        time: "06:02 AM",
        party: 4,
        name: "Family",
        email: "username@example.com",
      });

      const validateSpy = sinon.spy(reservations, "validate");

      await reservations.create(reservation);

      validateSpy.should.have.been.calledOnce.and.been.calledWith(
        sinon.match({
          party: 4,
          name: "Family",
          email: "username@example.com",
          phone: undefined,
          message: undefined,
          datetime: "2017-06-10T06:02:00.000Z",
        })
      );

      validateSpy.restore();
    });
  });
});
