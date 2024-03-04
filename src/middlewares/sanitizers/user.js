const { body } = require("express-validator");

const userSanitizer = {
  createUserBody: [body("name").trim().escape()],
};

module.exports = userSanitizer;
