const Post = require("../models/Post");
const Child = require("../models/Child");
const message = require("../models/message");

// POST /post - Create a new post
exports.createPost = async (req, res) => {
  try {
    const { child, content, images } = req.body;
    if (!child || !content) {
      return res.status(400).json({ message: "Child, and content are required." });
    }

    // Optional: Check if child exists
    const childDoc = await Child.findById(child);
    if (!childDoc) {
      return res.status(404).json({ message: "Child not found." });
    }

    const post = new Post({
      child,
      content,
      images: images || [],
    });

    const savedPost = await post.save();

    childDoc.post.push(savedPost._id);
    await childDoc.save();
    res.status(201).json({
        message: "Post created successfully",
        post: savedPost
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create post.", error: error.message });
  }
};

exports.getPostsByChildId = async (req, res) => {
  try {
    const { childId } = req.params;
    const posts = await Post.find({ child: childId }).sort({ createdAt: -1 });
 res.status(200).json({ 
        message: "Posts retrieved successfully",
        posts
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts.", error: error.message });
  }
};

// GET /:id - Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.status(200).json({ 
        message: "Post retrieved successfully",
        post
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch post.", error: error.message });
  }
};

// PUT /:id - Update a post by ID
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, images } = req.body;
    const updated = await Post.findByIdAndUpdate(
      id,
      { content, images, updatedAt: Date.now() },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.status(200).json({
      message: "Post updated successfully",
      post: updated
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update post.", error: error.message });
  }
};

// DELETE /:id - Delete a post by ID
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Post.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Post not found." });
    }
    // Optionally remove post from child's post array
    await Child.updateOne({ post: id }, { $pull: { post: id } });
    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post.", error: error.message });
  }
};
