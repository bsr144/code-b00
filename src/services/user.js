const userRepository = require("../repositories/user");

class UserService {
  constructor() {
    this.userRepository = new userRepository();
  }

  async createUser(userData) {
    return await this.userRepository.createUser(userData);
  }

  async getUserById(userId) {
    return await this.userRepository.findUserById(userId);
  }
}

module.exports = UserService;
