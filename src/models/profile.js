const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    age: Number,
    bio: String,
    interests: [String],
    gender: String,
    lookingFor: [String],
    profilePictures: [{ imageUrl: String }],
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
  },
  { timestamps: true }
);

profileSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Profile", profileSchema);
