const supertest = require("supertest");
const db = require("sqlite");

let app;

const dbSpy = jest.spyOn(db, "run");

const mockMorgan = jest.fn((req, res, next) => next());
const mockRun = jest.fn().mockResolvedValue({
  stmt: {
    lastID: 1349,
  },
});

beforeAll(() => {
  jest.mock("morgan", () => () => mockMorgan);
  dbSpy.mockImplementation(mockRun);

  app = supertest(require("../app"));
});

afterAll(() => {
  jest.unmock("morgan");
});

describe("GET", () => {
  it("should return the reservation form", async () => {
    const response = await app
      .get("/reservations")
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain(
      "To make reservations please fill out the following form"
    );
  });
});

describe("POST", () => {
  it("should reject an invalid reservation request", async () => {
    const response = await app.post("/reservations").type("form").send({
      date: "2017/06/10",
      time: "06:02 AM",
      party: "bananas",
      name: "Family",
      email: "username@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.text).toContain(
      "Sorry, there was a problem with your booking request"
    );
  });

  it("should accept a valid reservation request", async () => {
    const response = await app.post("/reservations").type("form").send({
      date: "2017/06/10",
      time: "06:02 AM",
      party: 4,
      name: "Family",
      email: "username@example.com",
    });

    expect(response.status).toBe(200);
    expect(response.text).toContain(
      "Thanks, your booking request #1349 is waiting to be confirmed"
    );
  });
});
