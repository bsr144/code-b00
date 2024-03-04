const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    text: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    celebrity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Celebrity",
      required: false,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
    personality: {
      MBTI: {
        type: String,
        enum: [
          "INFP",
          "INFJ",
          "ENFP",
          "ENFJ",
          "INTJ",
          "INTP",
          "ENTP",
          "ENTJ",
          "ISFP",
          "ISFJ",
          "ESFP",
          "ESFJ",
          "ISTP",
          "ISTJ",
          "ESTP",
          "ESTJ",
        ],
        required: false,
      },
      Enneagram: {
        type: String,
        enum: [
          "1w2",
          "2w3",
          "3w2",
          "3w4",
          "4w3",
          "4w5",
          "5w4",
          "5w6",
          "6w5",
          "6w7",
          "7w6",
          "7w8",
          "8w7",
          "8w9",
          "9w8",
          "9w1",
        ],
        required: false,
      },
      Zodiac: {
        type: String,
        enum: [
          "Aries",
          "Taurus",
          "Gemini",
          "Cancer",
          "Leo",
          "Virgo",
          "Libra",
          "Scorpio",
          "Sagittarius",
          "Capricorn",
          "Aquarius",
          "Pisces",
        ],
        required: false,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
