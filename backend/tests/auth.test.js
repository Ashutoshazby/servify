import request from "supertest";
import { app, clearDatabase, setupDatabase, teardownDatabase } from "./helpers.js";
import { User } from "../models/User.js";

beforeAll(setupDatabase);
afterAll(teardownDatabase);
beforeEach(clearDatabase);

describe("Authentication", () => {
  it("registers, requires verification, and then logs in a user", async () => {
    const registerResponse = await request(app).post("/api/auth/register").send({
      name: "Alice",
      email: "alice@test.com",
      password: "Password@123",
      phone: "9999999998",
      role: "customer",
    });

    expect(registerResponse.statusCode).toBe(201);
    expect(registerResponse.body.accessToken).toBeUndefined();

    const unverifiedLogin = await request(app).post("/api/auth/login").send({
      email: "alice@test.com",
      password: "Password@123",
    });

    expect(unverifiedLogin.statusCode).toBe(403);

    await User.findOneAndUpdate({ email: "alice@test.com" }, { emailVerified: true });

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "alice@test.com",
      password: "Password@123",
    });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.user.email).toBe("alice@test.com");
    expect(loginResponse.body.refreshToken).toBeDefined();
  });
});
