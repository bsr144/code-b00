const { body, param, query } = require("express-validator");

const commentSanitizer = {
  createCommentBody: [
    body("text").trim().escape(),
    body("author").trim().escape(),
    body("celebrity").trim().escape(),
    body("personality.MBTI").trim().escape(),
    body("personality.Enneagram").trim().escape(),
    body("personality.Zodiac").trim().escape(),
  ],
  likeCommentBody: [body("userId").trim().escape()],
  commentIdParam: [param("commentId").trim().escape()],
};

module.exports = commentSanitizer;
