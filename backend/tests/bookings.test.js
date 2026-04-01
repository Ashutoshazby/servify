import request from "supertest";
import { app, clearDatabase, createUserAndLogin, seedProviderFixture, setupDatabase, teardownDatabase } from "./helpers.js";

beforeAll(setupDatabase);
afterAll(teardownDatabase);
beforeEach(clearDatabase);

describe("Booking creation", () => {
  it("creates a booking for a customer", async () => {
    const { response } = await createUserAndLogin();
    const fixture = await seedProviderFixture();

    const bookingResponse = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${response.body.accessToken}`)
      .send({
        providerId: fixture.provider._id.toString(),
        serviceId: fixture.service._id.toString(),
        date: "2026-04-02",
        time: "10:00",
        price: 499,
        address: "Indiranagar",
        notes: "Bring tools",
      });

    expect(bookingResponse.statusCode).toBe(201);
    expect(bookingResponse.body.data.status).toBe("pending");
  });
});
