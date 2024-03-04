const CommentModel = require("../models/comment");

class CommentRepository {
  async create(commentData) {
    const comment = new CommentModel(commentData);
    await comment.save();
    return comment;
  }

  async findById(commentId) {
    return CommentModel.findById(commentId)
      .populate("celebrity")
      .populate("author")
      .populate({
        path: "likes",
        select: "id",
      });
  }

  async findAll(criteria = {}, sort = { createdAt: -1 }) {
    return CommentModel.find(criteria)
      .sort(sort)
      .populate("celebrity")
      .populate("author")
      .populate({
        path: "likes",
        select: "id",
      });
  }
}

module.exports = CommentRepository;
