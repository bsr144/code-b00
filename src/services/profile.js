const Profile = require("../entities/profile");
const ProfileRepository = require("../repositories/profile");

class ProfileService {
  constructor() {
    this.profileRepository = new ProfileRepository();
  }

  async createProfile(profileData) {
    const profile = new Profile({
      user: profileData.user,
      name: profileData.name,
      age: profileData.age,
      bio: profileData.bio,
      interests: profileData.interests,
      gender: profileData.gender,
      lookingFor: profileData.lookingFor,
      profilePictures: profileData.profilePictures,
      location: profileData.location,
    });

    return this.profileRepository.create(profile);
  }

  async getProfileById(profileId) {
    return this.profileRepository.findById(profileId);
  }
}

module.exports = ProfileService;
