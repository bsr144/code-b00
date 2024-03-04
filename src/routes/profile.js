const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile");
const profileSanitizer = require("../middlewares/sanitizers/profile");
const profileValidator = require("../middlewares/validators/profile");

router.post(
  "/",
  [profileSanitizer.createProfileBody, profileValidator.createProfileBody],
  profileController.createProfile
);

router.get(
  "/:profileId",
  [profileSanitizer.profileIdParam, profileValidator.profileIdParam],
  profileController.getProfileById
);

module.exports = router;
