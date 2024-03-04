class Profile {
  constructor({
    user,
    name,
    age,
    bio,
    interests,
    gender,
    lookingFor,
    profilePictures,
    location,
  }) {
    this.user = user;
    this.name = name;
    this.age = age;
    this.bio = bio;
    this.interests = interests;
    this.gender = gender;
    this.lookingFor = lookingFor;
    this.profilePictures = profilePictures;
    this.location = location;
  }
}

module.exports = Profile;
