const chai = require("chai");

const Reservation = require("../../../../lib/schema/reservation");

const should = chai.should();

describe("Reservation Schema", function () {
  context("Date and Time Combination", function () {
    it("should return an ISO 8601 date and time with valid input", () => {
      const date = "2017/06/10";
      const time = "06:02 AM";

      const expected = "2017-06-10T06:02:00.000Z";
      const actual = Reservation.combineDateTime(date, time);

      actual.should.equal(expected);
    });

    it("should return null on a bad date and time", () => {
      const date = "!@#$";
      const time = "fail";

      const actual = Reservation.combineDateTime(date, time);

      should.not.exist(actual);
    });
  });
});
