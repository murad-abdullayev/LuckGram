import { Router } from "express";
import {
  createPostSchema,
  updatePostSchema,
} from "../validation/publication.mjs";
import Publication from "../mongoose/schemas/publication.mjs";
import { authorize } from "../middlewares/user.mjs";
import validateSchema from "../middlewares/validator.mjs";
import User from "../mongoose/schemas/user.mjs";
import Comment from "../mongoose/schemas/comment.mjs";
import upload from "../multer/multerConfig.mjs";
import { deleteImageFile } from "../utils/delete-image.mjs";

const router = Router();

router.post(
  "/create-post",
  authorize(),
  upload.single("image"),
  validateSchema(createPostSchema),
  async (req, res) => {
    try {
      const publicationData = req.matchedData;
      publicationData.user = req.user._id;

      if (req.file) {
        publicationData.imageUrl = `/uploads/${req.file.filename}`;
      }

      const newPublication = new Publication(publicationData);
      await newPublication.save();

      const populatedPublication = await Publication.findById(
        newPublication._id
      ).populate("user");
      await User.findByIdAndUpdate(req.user._id, {
        $push: { publications: newPublication._id },
      });

      const publicationObj = populatedPublication.toObject();
      delete publicationObj.__v;

      res.json({
        message: "Post created successfully",
        publication: publicationObj,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating a post" });
    }
  }
);

router.patch(
  "/edit-post/:postId",
  authorize(),
  upload.single("image"),
  validateSchema(updatePostSchema),
  async (req, res) => {
    try {
      const postId = req.params.postId;
      const userId = req.user._id;
      const post = await Publication.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.user.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ message: "You do not have permission to edit this post" });
      }

      const updateData = req.body;
      if (req.file) {
        if (post.imageUrl) deleteImageFile(post.imageUrl);
        updateData.imageUrl = `/uploads/${req.file.filename}`;
      }

      const updatedPost = await Publication.findByIdAndUpdate(
        postId,
        updateData,
        { new: true, runValidators: true }
      ).populate("user");

      res.json({
        message: "Post updated successfully",
        post: updatedPost,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating post" });
    }
  }
);

router.get("/", authorize(), async (req, res) => {
  try {
    let postsQuery = Publication.find({});

    if (req.query.includeUsers === "true") {
      postsQuery = postsQuery.populate("user");
    }

    if (req.query.includeComments === "true") {
      postsQuery = postsQuery.populate("comments");
    }

    const posts = await postsQuery.exec();

    return res.json({
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching all posts" });
  }
});

router.get("/:postId", authorize(), async (req, res) => {
  try {
    const postId = req.params.postId;
    let postQuery = Publication.findById(postId);

    if (req.query.includeUsers === "true") {
      postQuery = postQuery.populate("user");
    }
    if (req.query.includeComments === "true") {
      postQuery = postQuery.populate("comments");
    }

    const post = await postQuery;

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.json({
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching post",
    });
  }
});

router.delete("/:postId", authorize(), async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;
    const post = await Publication.findById(postId);

    if (!post) {
      return res.json({ message: "Post not found" });
    }

    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You do not have permission to delete this post",
      });
    }

    if (post.imageUrl) deleteImageFile(post.imageUrl);

    await post.deleteOne();
    await User.findByIdAndUpdate(userId, { $pull: { publications: postId } });

    res.json({
      message: "Post deleted successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting post",
    });
  }
});

router.get("/:postId/comments", authorize(), async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.find({ publication: postId });

    if (!comments.length) {
      return res.status(404).json({
        message: "No comments found for this post",
      });
    }

    res.json({
      comments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching comments for the post",
      error,
    });
  }
});

export default router;
