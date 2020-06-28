const reservations = require("./reservations");
const Reservation = require("./schema/reservation");

describe("validate", () => {
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
      .then((value) => expect(value).toEqual(reservation));
  });

  it("should reject with an invalid email, Promises", () => {
    const reservation = new Reservation({
      date: "2017/06/10",
      time: "06:02 AM",
      party: 4,
      name: "Family",
      email: "username",
    });

    expect.assertions(1);

    return reservations
      .validate(reservation)
      .catch((error) => expect(error).toBeInstanceOf(Error));
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

    expect(value).toEqual(reservation);
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
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe("create", () => {
  it("should reject if validation fails, mock function", async () => {
    // Store the original
    const original = reservations.validate;

    const error = new Error("Fail");

    // Mock the function
    reservations.validate = jest.fn(() => Promise.reject(error));

    try {
      await reservations.create();
    } catch (err) {
      expect(err).toEqual(error);
    }

    expect(reservations.validate).toBeCalledTimes(1);

    reservations.validate = original;
  });
});
