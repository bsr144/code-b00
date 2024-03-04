const mongoose = require("mongoose");

const CelebritySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Celebrity", CelebritySchema);
