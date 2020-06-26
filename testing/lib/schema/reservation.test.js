const Reservation = require("./reservation");

describe("combineDateTime", () => {
  it("should return an ISO 8601 date and time with valid input", () => {
    const date = "2017/06/10";
    const time = "06:02 AM";

    const expected = "2017-06-10T06:02:00.000Z";
    const actual = Reservation.combineDateTime(date, time);

    expect(actual).toEqual(expected);
  });

  it("should return null on a bad date and time", () => {
    const date = "!@#$";
    const time = "fail";

    const actual = Reservation.combineDateTime(date, time);

    expect(actual).toBeNull();
  });
});

describe("validator", () => {
  it("should validate with no optional fields", (done) => {
    const reservation = new Reservation({
      date: "2017/06/10",
      time: "06:02 AM",
      party: 4,
      name: "Family",
      email: "username@example.com",
    });

    const callback = (err, value) => {
      try {
        expect(value).toEqual(reservation);
        return done(err);
      } catch (error) {
        return done(error);
      }
    };

    reservation.validator(callback);
  });

  it("should invalidate with an invalid email", (done) => {
    const reservation = new Reservation({
      date: "2017/06/10",
      time: "06:02 AM",
      party: 4,
      name: "Family",
      email: "username",
    });

    const callback = (err) => {
      try {
        expect(err).toBeInstanceOf(Error);
        return done();
      } catch (error) {
        return done(error);
      }
    };

    reservation.validator(callback);
  });
});
