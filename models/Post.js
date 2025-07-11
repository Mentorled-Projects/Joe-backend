const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    child: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child',
        required: true
    },
 
  content: {
    type: String,
    required: true,
  },
  images: [ {
      type: String, // URL or path to the image
      required: false,
  } ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;