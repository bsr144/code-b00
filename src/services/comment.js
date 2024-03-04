const Comment = require("../entities/comment");
const CommentRepository = require("../repositories/comment");

class CommentService {
  constructor() {
    this.commentRepository = new CommentRepository();
  }
  async createComment(commentData) {
    const comment = new Comment({
      text: commentData.text,
      author: commentData.author,
      celebrity: commentData.celebrity,
      likes: commentData.likes,
      likesCount: commentData.likesCount,
      personality: commentData.personality,
    });
    return await this.commentRepository.create(comment);
  }

  async getCommentById(commentId) {
    return this.commentRepository.findById(commentId);
  }

  async getComments(filterType, filterValue, sort) {
    let filters = {};
    if (filterType !== "All") {
      filters[`personality.${filterType}`] = filterValue;
    }

    let sortCriteria = {};
    if (sort === "best") {
      sortCriteria.likesCount = -1;
    } else {
      sortCriteria.createdAt = -1;
    }

    return this.commentRepository.findAll(filters, sortCriteria);
  }

  async likeComment(commentId, userId) {
    const comment = await this.commentRepository.findById(commentId);

    const index = comment.likes.findIndex(
      (like) => like._id.toString() === userId.toString()
    );

    if (index === -1) {
      comment.likes.push(userId);
      comment.likesCount += 1;
      await comment.save();
    }

    return comment;
  }

  async unlikeComment(commentId, userId) {
    const comment = await this.commentRepository.findById(commentId);
    const index = comment.likes.findIndex(
      (like) => like._id.toString() === userId.toString()
    );
    if (index > -1) {
      comment.likes.splice(index, 1); // Remove the userId from likes array
      comment.likesCount = Math.max(0, comment.likesCount - 1); // Decrement likesCount, ensuring it doesn't go below 0
      console.log(comment.likes, comment.likesCount);
      await comment.save();
    }
    return comment;
  }
}

module.exports = CommentService;
