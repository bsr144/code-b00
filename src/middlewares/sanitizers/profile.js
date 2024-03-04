const { body, param } = require("express-validator");

const profileSanitizer = {
  createProfileBody: [
    body("userId").trim().escape(),
    body("name").trim().escape(),
    body("bio").trim().escape(),
    body("interests.*").trim().escape(),
    body("lookingFor").trim().escape(),
    body("location.type").trim().escape(),
    body("location.coordinates").trim().escape(),
    body("profilePictures.*.imageUrl").trim(),
  ],
  profileIdParam: [param("profileId").trim().escape()],
};

module.exports = profileSanitizer;
