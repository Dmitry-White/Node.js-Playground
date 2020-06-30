const chai = require("chai");

const Reservation = require("../../../lib/schema/reservation");
const reservations = require("../../../lib/reservations");

// eslint-disable-next-line
const should = chai.should();

describe("Reservations Lib", function () {
  context("Validate", function () {
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
  });
});
