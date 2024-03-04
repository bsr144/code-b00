const { body, param } = require("express-validator");

const profileValidator = {
  createProfileBody: [
    body("user")
      .notEmpty()
      .withMessage("User (ID) is required.")
      .isString()
      .withMessage("User (ID) must be a string."),
    body("name")
      .notEmpty()
      .withMessage("Name is required.")
      .isString()
      .withMessage("Name must be a string."),
    body("age")
      .notEmpty()
      .withMessage("Age is required.")
      .isInt({ min: 18 })
      .withMessage("Age must be at least 18."),
    body("bio")
      .isLength({ min: 10 })
      .withMessage("Bio must be at least 10 characters long."),
    body("interests").isArray().withMessage("Interests must be an array."),
    body("interests.*")
      .notEmpty()
      .withMessage("Each interest must be non-empty.")
      .isString()
      .withMessage("Each interest must be a string."),
    body("lookingFor").notEmpty().withMessage("Looking for cannot be empty."),
    body("location.type")
      .isString()
      .withMessage("Location type must be a string."),
    body("location.coordinates")
      .notEmpty()
      .withMessage("Each coordinate must be non-empty.")
      .isLatLong()
      .withMessage("Each interest must be in <lat,long> format."),
    body("profilePictures")
      .isArray()
      .withMessage("Profile pictures must be an array."),
    body("profilePictures.*.imageUrl")
      .notEmpty()
      .withMessage("Each interest must be non-empty.")
      .isURL()
      .withMessage("Each profile picture must have a valid URL."),
  ],
  profileIdParam: [
    param("profileId")
      .isMongoId()
      .withMessage("Profile ID must be a valid ObjectId."),
  ],
};

module.exports = profileValidator;
