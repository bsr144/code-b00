const ProfileModel = require("../models/profile");

class ProfileRepository {
  async create(profileData) {
    const profile = new ProfileModel(profileData);
    await profile.save();
    return profile;
  }

  async findById(profileId) {
    return ProfileModel.findById(profileId).populate("user");
  }
}

module.exports = ProfileRepository;
