const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const userSanitizer = require("../middlewares/sanitizers/user");
const userValidator = require("../middlewares/validators/user");

router.post(
  "/",
  [userSanitizer.createUserBody, userValidator.createUserBody],
  userController.createUser
);

module.exports = router;
