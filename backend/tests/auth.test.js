import request from "supertest";
import { app, clearDatabase, setupDatabase, teardownDatabase } from "./helpers.js";

beforeAll(setupDatabase);
afterAll(teardownDatabase);
beforeEach(clearDatabase);

describe("Authentication", () => {
  it("registers and logs in a user", async () => {
    const registerResponse = await request(app).post("/api/auth/register").send({
      name: "Alice",
      email: "alice@test.com",
      password: "Password@123",
      phone: "9999999998",
      role: "customer",
    });

    expect(registerResponse.statusCode).toBe(201);
    expect(registerResponse.body.accessToken).toBeDefined();

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "alice@test.com",
      password: "Password@123",
    });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.user.email).toBe("alice@test.com");
    expect(loginResponse.body.refreshToken).toBeDefined();
  });
});
