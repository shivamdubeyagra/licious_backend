const postRouter = require("express").Router();
const authMiddleware = require("../middlerwares/auth.js");
const PostModel = require("../models/post.model.js");

postRouter.post("/posts", authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const author = req.user._id;
  try {
    const newPost = new PostModel({ title, content, author });
    await newPost.save();
    res
      .status(201)
      .send({ message: "Post created successfully.", post: newPost });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong while creating the post.",
      error,
    });
  }
});

postRouter.delete("/posts/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await PostModel.findOneAndDelete({
      _id: id,
      author: req.user._id,
    });
    if (post) {
      return res.status(200).send({ message: "Post deleted successfully." });
    } else {
      return res.status(404).send({
        message: "Post not found or not authorized to delete this post.",
      });
    }
  } catch (error) {
    return res.status(500).send({ message: "Failed to delete post.", error });
  }
});

postRouter.get("/posts", authMiddleware, async (req, res) => {
  try {
    const posts = await PostModel.find({ author: req.user._id });
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send({ message: "Failed to retrieve posts.", error });
  }
});

module.exports = postRouter;
