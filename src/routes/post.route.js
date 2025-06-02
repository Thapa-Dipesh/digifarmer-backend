import express from "express";
import { validatePost } from "../middlewares/validation.middleware.js";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../config/multer.config.js";
import { likePost } from "../controllers/likePost.controller.js";
import {
  createComment,
  deleteComment,
  getCommentsByPostId,
  updateComment,
} from "../controllers/commentPost.controller.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  validatePost,
  upload.array("image", 12),
  createPost
);
router.get("/all-posts", getPosts);
router.get("/post/:id", getPostById);
router.patch(
  "/post/:id",
  authMiddleware,
  validatePost,
  upload.array("image", 12),
  updatePost
);
router.delete("/post/:id", authMiddleware, deletePost);

// Route for liking a post
router.post("/post/:postId/like", authMiddleware, likePost);

// Route for commenting on a post
router.post("/post/:postId/comments", authMiddleware, createComment);
router.get("/post/:postId/comments", getCommentsByPostId);
router.patch("/comments/:commentId", authMiddleware, updateComment);
router.delete("/comments/:commentId", authMiddleware, deleteComment);

export default router;
