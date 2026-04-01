import crypto from "crypto";
import request from "supertest";
import { app, clearDatabase, createUserAndLogin, seedProviderFixture, setupDatabase, teardownDatabase } from "./helpers.js";
import { Booking } from "../models/Booking.js";
import { Payment } from "../models/Payment.js";

beforeAll(setupDatabase);
afterAll(teardownDatabase);
beforeEach(clearDatabase);

describe("Payment verification", () => {
  it("verifies a payment signature and updates the payment record", async () => {
    process.env.RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "test_secret";
    const { response, payload } = await createUserAndLogin();
    const fixture = await seedProviderFixture();
    const customer = response.body.user;

    const booking = await Booking.create({
      userId: customer._id,
      providerId: fixture.provider._id,
      serviceId: fixture.service._id,
      date: "2026-04-03",
      time: "11:00",
      price: 499,
    });

    await Payment.create({
      bookingId: booking._id,
      userId: customer._id,
      amount: 499,
      orderId: "order_test_123",
    });

    const paymentId = "pay_test_123";
    const signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`order_test_123|${paymentId}`)
      .digest("hex");

    const verifyResponse = await request(app)
      .post("/api/payment/verify")
      .set("Authorization", `Bearer ${response.body.accessToken}`)
      .send({
        orderId: "order_test_123",
        paymentId,
        signature,
      });

    expect(verifyResponse.statusCode).toBe(200);
    expect(verifyResponse.body.data.paymentStatus).toBe("paid");
  });
});
