// tests/api.test.js
const request = require("supertest");
const app = require("../src/express"); // Path to your Express app
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { MongoMemoryServer } = require("mongodb-memory-server");
const profile = require("../src/models/profile");

describe("API Integration Tests", () => {
  let mongoServer;
  let userId1;
  let userId2;
  let commentId1;
  let commentId2;

  const profileRequest = {
    name: "Bastian",
    age: 20,
    bio: "Software engineer with a passion for technology and outdoor activities.",
    interests: ["Technology", "Hiking", "Reading"],
    gender: "Male",
    lookingFor: ["Companionship", "Friendship", "Tech meetups"],
    profilePictures: [
      { imageUrl: "http://example.com/path/to/image1.jpg" },
      { imageUrl: "http://example.com/path/to/image2.jpg" },
    ],
    location: {
      type: "Point",
      coordinates: "37.773972, -122.431297",
    },
  };

  const commentRequest1 = {
    text: "Best actor ever!",
    personality: {
      MBTI: "INTJ",
      Enneagram: "5w4",
      Zodiac: "Leo",
    },
  };

  const commentRequest2 = {
    text: "Best entrepreneur ever!",
    personality: {
      MBTI: "INTJ",
      Enneagram: "8w9",
      Zodiac: "Libra",
    },
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should create a user", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ name: "John Doe" });

    expect(response.statusCode).toBe(201);
    expect(response.body.userId).toBeDefined();
    expect(ObjectId.isValid(response.body.userId)).toBe(true);
    userId1 = response.body.userId;
  });

  it("should create another new user", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ name: "Kurama" });

    expect(response.statusCode).toBe(201);
    expect(response.body.userId).toBeDefined();
    expect(ObjectId.isValid(response.body.userId)).toBe(true);
    expect(userId1).not.toBe(userId2);

    userId2 = response.body.userId;
  });

  it("should fail to create a user with empty name", async () => {
    const response = await request(app).post("/api/users").send({ name: "" });

    expect(response.statusCode).toBe(422);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
  });

  it("should create a profile", async () => {
    profileRequest.user = userId1;

    const response = await request(app)
      .post("/api/profiles")
      .send(profileRequest);

    expect(response.statusCode).toBe(201);
    expect(response.body.profileId).toBeDefined();
    expect(ObjectId.isValid(response.body.profileId)).toBe(true);
  });

  it("should fail to create a profile with one of empty field", async () => {
    profileRequest.name = "";

    const response = await request(app)
      .post("/api/profiles")
      .send(profileRequest);

    expect(response.statusCode).toBe(422);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);

    profileRequest.name = "Bastian";
  });

  it("should fail to create a profile with Age at least 18", async () => {
    profileRequest.age = "17";

    const response = await request(app)
      .post("/api/profiles")
      .send(profileRequest);

    expect(response.statusCode).toBe(422);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);

    const typeError = response.body.errors.find(
      (error) => error.msg === "Age must be at least 18."
    );

    expect(typeError).toBeDefined();

    profileRequest.age = 20;
  });

  it("should create two comments", async () => {
    commentRequest1.author = userId1;
    commentRequest2.author = userId1;

    const arrOfComments = [];

    const response1 = await request(app)
      .post("/api/comments")
      .send(commentRequest1);

    expect(response1.statusCode).toBe(201);
    expect(response1.body.commentId).toBeDefined();
    expect(ObjectId.isValid(response1.body.commentId)).toBe(true);

    commentId1 = response1.body.commentId;
    arrOfComments.push(response1.body);

    const response2 = await request(app)
      .post("/api/comments")
      .send(commentRequest2);

    expect(response2.statusCode).toBe(201);
    expect(response2.body.commentId).toBeDefined();
    expect(ObjectId.isValid(response2.body.commentId)).toBe(true);

    arrOfComments.push(response2.body);

    commentId2 = response2.body.commentId;

    expect(arrOfComments.length).toBe(2);

    for (let i = 0; i < arrOfComments.length; i++) {
      for (let j = i + 1; j < arrOfComments.length; j++) {
        expect(arrOfComments[i].commentId).not.toBe(arrOfComments[j].commentId);
      }
    }
  });

  // Test GET /api/comments without any query
  it("should get all comments", async () => {
    const response = await request(app).get("/api/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  // Test GET /api/comments/:commentId
  it("should get a comment by id", async () => {
    const response = await request(app).get(`/api/comments/${commentId1}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBeDefined();
  });

  // Test POST /api/comments/:commentId/like
  it("should like the first comment", async () => {
    const response = await request(app)
      .post(`/api/comments/${commentId1}/like`)
      .send({ userId: userId1 });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.likesCount).toBe(1);
  });

  it("should like the second comment", async () => {
    const response = await request(app)
      .post(`/api/comments/${commentId2}/like`)
      .send({ userId: userId1 });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.likesCount).toBe(1);
  });

  // Test the idempotency of liking a comment
  it("should not add a like to the first comment if already liked by the same user", async () => {
    const response = await request(app)
      .post(`/api/comments/${commentId1}/like`)
      .send({ userId: userId1 });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.likesCount).toBe(1);
  });

  // Test the idempotency of liking a comment
  it("should add another like to the first comment because liked by the different user", async () => {
    const response = await request(app)
      .post(`/api/comments/${commentId1}/like`)
      .send({ userId: userId2 });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.likesCount).toBe(2);
  });

  // Test POST /api/comments/:commentId/unlike
  it("should unlike a comment", async () => {
    const response = await request(app)
      .post(`/api/comments/${commentId1}/unlike`)
      .send({ userId: userId1 });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.likesCount).toBe(1);
  });

  it("should unlike a comment and reduce the number of likes to zero", async () => {
    const response = await request(app)
      .post(`/api/comments/${commentId1}/unlike`)
      .send({ userId: userId2 });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.likesCount).toBe(0);
  });

  // Test GET /api/comments with sorting variations
  it("should get all comments sorted by recent and check that one of the comment still have one like", async () => {
    const response = await request(app).get("/api/comments?sort=recent");

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);

    // Expect the first comment to be the most recent one
    expect(response.body.data[0].likes.length).toBe(1);
    expect(response.body.data[1].likes.length).toBe(0);
  });

  it("should get all comments sorted by best", async () => {
    const response = await request(app).get("/api/comments?sort=best");

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);

    for (let i = 0; i < response.body.data.length; i++) {
      for (let j = i + 1; j < response.body.data.length; j++) {
        expect(response.body.data[i].likes.length).toBeGreaterThanOrEqual(
          response.body.data[j].likes.length
        );
      }
    }
  });

  it("should get empty comments sorted by MBTI ENTJ", async () => {
    const response = await request(app).get(
      "/api/comments?type=MBTI&MBTI=ENTJ&sort=best"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);

    expect(response.body.data.length).toBe(0);
  });

  it("should get all comments sorted by MBTI INTJ", async () => {
    const response = await request(app).get(
      "/api/comments?type=MBTI&MBTI=INTJ&sort=best"
    );
    console.log(response.body.data);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);

    expect(response.body.data.length).toBeGreaterThan(0);

    for (const eachObject of response.body.data) {
      expect(eachObject.personality.MBTI).toBe("INTJ");
    }
  });

  it("should get empty comments sorted by Enneagram 7w8", async () => {
    const response = await request(app).get(
      "/api/comments?type=Enneagram&Enneagram=7w8&sort=best"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);

    expect(response.body.data.length).toBe(0);
  });

  it("should get all comments sorted by Enneagram 8w9", async () => {
    const response = await request(app).get(
      "/api/comments?type=Enneagram&Enneagram=8w9&sort=best"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);

    expect(response.body.data.length).toBe(1);

    for (const eachObject of response.body.data) {
      expect(eachObject.personality.Enneagram).toBe("8w9");
    }
  });

  it("should get all comments sorted by Enneagram 5w4", async () => {
    const response = await request(app).get(
      "/api/comments?type=Enneagram&Enneagram=5w4&sort=best"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);

    expect(response.body.data.length).toBe(1);

    for (const eachObject of response.body.data) {
      expect(eachObject.personality.Enneagram).toBe("5w4");
    }
  });

  it("should get all comments sorted by Zodiac Leo", async () => {
    const response = await request(app).get(
      "/api/comments?type=Zodiac&Zodiac=Leo&sort=best"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);

    expect(response.body.data.length).toBe(1);

    for (const eachObject of response.body.data) {
      expect(eachObject.personality.Zodiac).toBe("Leo");
    }
  });

  it("should get all comments sorted by Zodiac Libra", async () => {
    const response = await request(app).get(
      "/api/comments?type=Zodiac&Zodiac=Libra&sort=best"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);

    expect(response.body.data.length).toBe(1);

    for (const eachObject of response.body.data) {
      expect(eachObject.personality.Zodiac).toBe("Libra");
    }
  });

  it("should fail to get all comments with wrong type", async () => {
    const response = await request(app).get(
      "/api/comments?type=undefined&Zodiac=Libra&sort=best"
    );
    expect(response.statusCode).toBe(422);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);

    const typeError = response.body.errors.find(
      (error) => error.msg === "Invalid query type"
    );

    expect(typeError).toBeDefined();
  });

  it("should fail to get all comments with wrong sort", async () => {
    const response = await request(app).get(
      "/api/comments?type=Zodiac&Zodiac=Libra&sort=undefined"
    );
    expect(response.statusCode).toBe(422);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);

    const typeError = response.body.errors.find(
      (error) => error.msg === "Invalid query sort"
    );

    expect(typeError).toBeDefined();
  });

  it("should fail to get all comments with wrong Zodiac type", async () => {
    const response = await request(app).get(
      "/api/comments?type=Zodiac&Zodiac=undefined&sort=recent"
    );
    expect(response.statusCode).toBe(422);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);

    const typeError = response.body.errors.find(
      (error) => error.msg === "Invalid query Zodiac sign."
    );

    expect(typeError).toBeDefined();
  });

  it("should fail to get all comments with wrong MBTI type", async () => {
    const response = await request(app).get(
      "/api/comments?type=MBTI&MBTI=ZZZZ&sort=recent"
    );
    expect(response.statusCode).toBe(422);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);

    const typeError = response.body.errors.find(
      (error) => error.msg === "Invalid query MBTI sign."
    );

    expect(typeError).toBeDefined();
  });

  it("should fail to get all comments with wrong Enneagram type", async () => {
    const response = await request(app).get(
      "/api/comments?type=Enneagram&Enneagram=2wd&sort=recent"
    );
    expect(response.statusCode).toBe(422);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);

    const typeError = response.body.errors.find(
      (error) => error.msg === "Invalid query Enneagram sign."
    );

    expect(typeError).toBeDefined();
  });
});
