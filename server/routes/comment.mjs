import { Router } from "express";
import { authorize } from "../middlewares/user.mjs";
import validateSchema from "../middlewares/validator.mjs";
import { createCommentSchema } from "../validation/comment.mjs";
import Comment from "../mongoose/schemas/comment.mjs";
import User from "../mongoose/schemas/user.mjs";
import Publication from "../mongoose/schemas/publication.mjs";

const router = Router();

router.post(
  "/leave-comment/:postId",
  authorize(),
  validateSchema(createCommentSchema),
  async (req, res) => {
    try {
      const commentData = req.matchedData;
      const user = req.user;
      const publicationId = req.params.postId;

      commentData.user = user._id;
      commentData.publication = publicationId;

      const newComment = new Comment(commentData);
      await newComment.save();

      const populatedComment = await Comment.findById(newComment._id)
        .populate("user")
        .populate("publication");

      await Promise.all([
        User.findByIdAndUpdate(user._id, {
          $push: { comments: newComment._id },
        }).catch((err) => {
          console.error("Error updating user:", err);
          throw err;
        }),
        Publication.findByIdAndUpdate(publicationId, {
          $push: { comments: newComment._id },
        }).catch((err) => {
          console.error("Error updating publication:", err);
          throw err;
        }),
      ]);

      const commentObj = populatedComment.toObject();
      delete commentObj._v;

      res.json({
        message: "Comment successfully left",
        comment: commentObj,
      });
    } catch (error) {
      res.status(500).json({ message: "Error leaving comment", error });
    }
  }
);

router.patch(
  "/edit-comment/:commentId",
  authorize(),
  validateSchema(createCommentSchema),
  async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const updatedData = req.body;
      const userId = req.user._id;

      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({
          message: "Comment not found",
        });
      }

      if (comment.user.toString() !== userId.toString()) {
        return res.status(403).json({
          message: "You do not have permission to edit this comment",
        });
      }

      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        updatedData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("user")
        .populate("publication");

      res.json({
        message: "Comment updated successfully",
        comment: updatedComment,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating comment",
        error,
      });
    }
  }
);

router.get("/:commentId", authorize(), async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId)
      .populate("user")
      .populate("publication");

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    res.json({
      comment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching comment",
      error,
    });
  }
});

router.delete("/delete-comment/:commentId", authorize(), async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const post = await Publication.findById(comment.publication);

    if (!post) {
      return res.status(404).json({
        message: "Post not found for this comment",
      });
    }

    if (
      comment.user.toString() !== userId.toString() &&
      post.user.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        message: "You do not have permission to delete this comment",
      });
    }

    await comment.deleteOne();

    await Promise.all([
      User.findByIdAndUpdate(comment.user, { $pull: { comments: commentId } }),
      Publication.findByIdAndUpdate(post._id, {
        $pull: { comments: commentId },
      }),
    ]);

    res.json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting comment",
      error,
    });
  }
});

export default router;
