const ProfileService = require("../../src/services/profile");
const Profile = require("../../src/entities/profile");
const ProfileRepository = require("../../src/repositories/profile");

// Mock the dependencies
jest.mock("../../src/entities/profile", () => {
  return jest.fn().mockImplementation(() => ({
    // Mock other properties and methods as needed, excluding setCoordinatesFromString
  }));
});

jest.mock("../../src/repositories/profile"); // Mock the ProfileRepository

describe("ProfileService", () => {
  let profileService;
  let mockProfileData;
  let mockProfile;

  beforeEach(() => {
    Profile.mockClear();
    ProfileRepository.mockClear();

    profileService = new ProfileService();

    mockProfileData = {
      userId: "user123",
      name: "John Doe",
      age: 30,
      bio: "Lorem ipsum",
      interests: ["coding", "gaming"],
      gender: "male",
      lookingFor: "friendship",
      profilePictures: ["url1", "url2"],
      location: { type: "Point", coordinates: "10,20" },
    };

    mockProfile = { ...mockProfileData, id: "profile123" };
    Profile.mockImplementation(() => mockProfile);
    ProfileRepository.prototype.create.mockResolvedValue(mockProfile);
  });

  test("createProfile creates and persists a profile", async () => {
    const profile = await profileService.createProfile(mockProfileData);

    expect(Profile).toHaveBeenCalledWith(mockProfileData);
    expect(ProfileRepository.prototype.create).toHaveBeenCalledWith(
      mockProfile
    );
    expect(profile).toEqual(mockProfile);
  });

  test("getProfileById retrieves a profile by ID", async () => {
    const profileId = "profile123";
    ProfileRepository.prototype.findById.mockResolvedValue(mockProfile);

    const profile = await profileService.getProfileById(profileId);

    expect(ProfileRepository.prototype.findById).toHaveBeenCalledWith(
      profileId
    );
    expect(profile).toEqual(mockProfile);
  });
});
