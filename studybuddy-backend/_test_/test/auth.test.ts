// src/test/auth.test.ts
import request from "supertest";
import express from "express";
import { connectTestDB, disconnectTestDB, clearTestDB } from "../setup";
import authRouter from "../../src/routes/auth/index";

jest.setTimeout(30000); // increase timeout for slow DB setup

const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearTestDB();
});

describe("Auth APIs", () => {
  const userPayload = { name: "Test User", email: "test@example.com", password: "password123" };

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(userPayload);
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  it("should not register a user with duplicate email", async () => {
    await request(app).post("/api/auth/register").send(userPayload);
    const res = await request(app).post("/api/auth/register").send(userPayload);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("A user already exists with this email");
  });

  it("should login a registered user", async () => {
    await request(app).post("/api/auth/register").send(userPayload);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: userPayload.email, password: userPayload.password });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it("should not login with incorrect password", async () => {
    await request(app).post("/api/auth/register").send(userPayload);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: userPayload.email, password: "wrongpass" });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid password");
  });

  it("should not login unregistered user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nouser@example.com", password: "password123" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User not registered. Please sign up before logging in.");
  });
});
