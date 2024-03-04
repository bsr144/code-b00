const CommentService = require("../services/comment");
const commentService = new CommentService();

const { validationResult } = require("express-validator");

const createComment = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  if (!req.body.celebrity) req.body.celebrity = null;

  const comment = await commentService.createComment(req.body);

  return res.status(201).json({
    message: "Comment successfully created",
    success: true,
    commentId: comment._id,
  });
};

const getCommentById = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const comment = await commentService.getCommentById(req.params.id);
  if (!comment) {
    return res.status(404).json({
      message: "Comment not found",
      success: false,
    });
  }
  res.status(200).json({
    success: true,
    data: comment,
  });
};

const getComments = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { type = "All", MBTI, Enneagram, Zodiac, sort = "recent" } = req.query;

  let filterType = type;
  let filterValue;

  switch (type) {
    case "MBTI":
      filterValue = MBTI;
      break;
    case "Enneagram":
      filterValue = Enneagram;
      break;
    case "Zodiac":
      filterValue = Zodiac;
      break;
  }

  try {
    const comments = await commentService.getComments(
      filterType,
      filterValue,
      sort
    );
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const likeComment = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { commentId } = req.params;
  const { userId } = req.body;

  try {
    const updatedComment = await commentService.likeComment(commentId, userId);
    return res.status(200).json({
      message: "Comment liked successfully",
      data: {
        likesCount: updatedComment.likesCount,
        liked: true,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to like comment",
      error: error.toString(),
    });
  }
};

const unlikeComment = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { commentId } = req.params;
  const { userId } = req.body;

  try {
    const updatedComment = await commentService.unlikeComment(
      commentId,
      userId
    );
    return res.status(200).json({
      message: "Comment unliked successfully",
      data: {
        likesCount: updatedComment.likesCount,
        liked: false,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to unlike comment",
      error: error.toString(),
    });
  }
};

module.exports = {
  createComment,
  getCommentById,
  getComments,
  likeComment,
  unlikeComment,
};
