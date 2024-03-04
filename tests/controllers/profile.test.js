const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const {
  createProfile,
  getProfileById,
} = require("../../src/controllers/profile");
const ProfileService = require("../../src/services/profile");
const { validationResult } = require("express-validator");

jest.mock("../../src/services/profile");

jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

const app = express();
app.use(bodyParser.json());
app.post("/api/profiles", createProfile);
app.get("/api/profiles/:id", getProfileById);

describe("Profile Controller Tests", () => {
  beforeEach(() => {
    ProfileService.mockClear();
  });

  test("POST /api/profiles - Success", async () => {
    validationResult.mockImplementation((req) => ({
      isEmpty: () => true,
      array: () => [],
    }));

    const mockProfile = {
      _id: "123",
      name: "Test Profile",
    };
    ProfileService.prototype.createProfile.mockResolvedValue(mockProfile);

    const response = await request(app)
      .post("/api/profiles")
      .send({
        name: "Test Profile",
        location: { type: "Point", coordinates: "10, 20" },
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      message: "profile successfully created",
      success: true,
      profile_id: mockProfile._id,
    });
  });

  test("POST /api/profiles - Validation Error", async () => {
    validationResult.mockImplementation((req) => ({
      isEmpty: () => false,
      array: () => [
        {
          type: "field",
          value: "",
          msg: "Name is required.",
          path: "name",
          location: "body",
        },
      ],
    }));

    const response = await request(app)
      .post("/api/profiles")
      .send({ name: "" });

    expect(response.statusCode).toBe(422);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toEqual([
      {
        type: "field",
        value: "",
        msg: "Name is required.",
        path: "name",
        location: "body",
      },
    ]);
  });

  test("GET /api/profiles/:id - Success", async () => {
    const mockProfile = { _id: "123", name: "Test Profile" };
    ProfileService.prototype.getProfileById.mockResolvedValue(mockProfile);

    const response = await request(app).get("/api/profiles/123");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: mockProfile,
    });
  });

  test("GET /api/profiles/:id - Not Found", async () => {
    ProfileService.prototype.getProfileById.mockResolvedValue(null);

    const response = await request(app).get("/api/profiles/unknown");

    expect(response.statusCode).toBe(404);
  });
});
