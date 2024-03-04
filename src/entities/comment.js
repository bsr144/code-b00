class Comment {
  constructor({ text, author, celebrity, likes, likesCount, personality }) {
    this.text = text;
    this.author = author;
    this.celebrity = celebrity;
    this.likes = likes;
    this.likesCount = likesCount || 0;
    this.personality = personality || {
      MBTI: null,
      Enneagram: null,
      Zodiac: null,
    };
  }
}

module.exports = Comment;
