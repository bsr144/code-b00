const { body, param, query } = require("express-validator");

const commentValidator = {
  createCommentBody: [
    body("text").notEmpty().withMessage("Text is required."),
    body("author")
      .notEmpty()
      .withMessage("Author (ID) is required.")
      .isString()
      .withMessage("Author (ID) must be a string."),
    body("celebrity")
      .optional()
      .isString()
      .withMessage("Celebrity (ID) must be a string."),
    body("personality.MBTI")
      .optional()
      .isIn([
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
      ])
      .withMessage("Invalid MBTI type."),
    body("personality.Enneagram")
      .optional()
      .isIn([
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
      ])
      .withMessage("Invalid Enneagram type."),
    body("personality.Zodiac")
      .optional()
      .isIn([
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
      ])
      .withMessage("Invalid Zodiac sign."),
  ],
  likeCommentBody: [
    body("userId").isString().withMessage("User ID must be a string."),
  ],
  commentIdParam: [
    param("commentId").isString().withMessage("Comment ID must be a string."),
  ],
  getCommentQuery: [
    query("type")
      .optional()
      .isString()
      .withMessage("Query type must be a string")
      .isIn(["All", "MBTI", "Enneagram", "Zodiac"])
      .withMessage("Invalid query type"),
    query("MBTI")
      .optional()
      .isString()
      .isIn([
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
      ])
      .withMessage("Invalid query MBTI sign."),
    query("Enneagram")
      .optional()
      .isString()
      .isIn([
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
      ])
      .withMessage("Invalid query Enneagram sign."),
    query("Zodiac")
      .optional()
      .isString()
      .isIn([
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
      ])
      .withMessage("Invalid query Zodiac sign."),
    query("sort")
      .optional()
      .isString()
      .withMessage("Query type must be a string")
      .isIn(["recent", "best"])
      .withMessage("Invalid query sort"),
  ],
};

module.exports = commentValidator;
