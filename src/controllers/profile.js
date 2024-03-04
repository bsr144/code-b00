const ProfileService = require("../services/profile");

const profileService = new ProfileService();

const { validationResult } = require("express-validator");

const createProfile = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const coordinatesArray = req.body.location.coordinates.split(",").map(Number);
  req.body.location.coordinates = [coordinatesArray[1], coordinatesArray[0]];

  const profile = await profileService.createProfile(req.body);

  return res.status(201).json({
    message: "profile successfully created",
    success: true,
    profileId: profile._id,
  });
};

const getProfileById = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const profile = await profileService.getProfileById(req.params.profileId);
  if (!profile) {
    return res.status(404).json({
      message: "failed to get profile",
      success: false,
    });
  }
  res.status(200).json({
    success: true,
    data: profile,
  });
};

module.exports = {
  createProfile,
  getProfileById,
};
