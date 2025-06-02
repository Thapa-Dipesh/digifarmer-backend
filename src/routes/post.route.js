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

export default router;
