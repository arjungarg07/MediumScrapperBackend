const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, 
    unique: true
  },
  url: {
    type: String,
  },
  clapCount: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    default: false
  },
  latestPublishedAt: {
    type: Date, 
    default: Date.now
  },
  readingTime: {
    type: Number,
    default: 0
},
  subtitle: {
    type: String, 
  }
});
  
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
