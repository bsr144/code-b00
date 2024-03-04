const UserService = require("../services/user");
const userService = new UserService();

const { validationResult } = require("express-validator");

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const user = await userService.createUser(req.body);
    return res.status(201).json({
      message: "User successfully created",
      success: true,
      userId: user._id,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createUser,
};
