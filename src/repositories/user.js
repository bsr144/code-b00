const User = require("../models/user");

class UserRepository {
  async createUser(userData) {
    const user = new User(userData);
    await user.save();
    return user;
  }

  async findUserById(userId) {
    return User.findById(userId);
  }
}

module.exports = UserRepository;
