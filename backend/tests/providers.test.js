import request from "supertest";
import { app, clearDatabase, seedProviderFixture, setupDatabase, teardownDatabase } from "./helpers.js";

beforeAll(setupDatabase);
afterAll(teardownDatabase);
beforeEach(clearDatabase);

describe("Provider listing", () => {
  it("returns paginated providers with filtering", async () => {
    const fixture = await seedProviderFixture();

    const response = await request(app)
      .get("/api/providers")
      .query({ categoryId: fixture.category._id.toString(), verified: "true", page: 1, limit: 10 });

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.pagination.total).toBe(1);
  });
});
