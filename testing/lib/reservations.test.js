const mockDebug = jest.fn();
const mockRun = jest.fn().mockResolvedValue([1]);

jest.mock("debug", () => () => mockDebug);
jest.mock("sqlite", () => {
  return {
    run: mockRun,
  };
});

const reservations = require("./reservations");
const Reservation = require("./schema/reservation");

describe("save", () => {
  let reservations;

  beforeAll(() => {
    reservations = require("./reservations");
  });

  it("should be mocked and not create a DB record", async () => {
    const reservation = new Reservation({
      date: "2017/06/10",
      time: "06:02 AM",
      party: 4,
      name: "Family",
      email: "username",
    });
    const expected = [1];

    const data = await reservations.save(reservation);

    expect(mockDebug).toBeCalledTimes(1);
    expect(mockRun).toBeCalledTimes(1);
    expect(data).toStrictEqual(expected);
  });
});

describe("getAll", () => {
  let reservations;

  beforeAll(() => {
    jest.mock("./reservations");
    reservations = require("./reservations");
  });

  afterAll(() => {
    jest.unmock("./reservations");
  });

  it("should be mocked and not create a DB record", async () => {
    const data = await reservations.getAll();
    expect(data).toBeUndefined();
  });
});

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
