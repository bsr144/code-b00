const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment");
const commentSanitizer = require("../middlewares/sanitizers/comment");
const commentValidator = require("../middlewares/validators/comment");

router.post(
  "/",
  [commentSanitizer.createCommentBody, commentValidator.createCommentBody],
  commentController.createComment
);

router.get(
  "/",
  [commentValidator.getCommentQuery],
  commentController.getComments
);
router.get(
  "/:id",
  [commentSanitizer.commentIdParam, commentValidator.commentIdParam],
  commentController.getCommentById
);
router.post(
  "/:commentId/like",
  [
    commentSanitizer.commentIdParam,
    commentSanitizer.likeCommentBody,
    commentValidator.commentIdParam,
    commentValidator.likeCommentBody,
  ],
  commentController.likeComment
);
router.post(
  "/:commentId/unlike",
  [
    commentSanitizer.commentIdParam,
    commentSanitizer.likeCommentBody,
    commentValidator.commentIdParam,
    commentValidator.likeCommentBody,
  ],
  commentController.unlikeComment
);

module.exports = router;
