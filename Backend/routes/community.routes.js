import express from "express";
import {updatePost, createPost, getFeed, likePost, commentPost, replyComment, bookmarkPost, followUser, getTrendingFeed } from "../controllers/community.controller.js";
import { verifyToken } from "../middlewares/verifytoken.js";
import { postLimiter } from "../middlewares/rateLimiter.js";
const router = express.Router();

router.post("/post", verifyToken, createPost);

router.patch(
  "/post/:postId",
  verifyToken,
  postLimiter,
 updatePost
);

router.get("/feed",  postLimiter,getFeed);

router.post(
  "/post/:postId/like",
  verifyToken,
  postLimiter,
  likePost
);

router.post(
  "/post/:postId/comment",
  verifyToken,
  postLimiter,
commentPost
);

router.post(
  "/comment/:commentId/reply",
  verifyToken,
  postLimiter,
  replyComment
);

router.post(
  "/post/:postId/bookmark",
  verifyToken,
  postLimiter,
 bookmarkPost
);

router.post(
  "/follow/:userId",
  verifyToken,
  postLimiter,
  followUser
);

router.get(
  "/trending",
 
  postLimiter,
 getTrendingFeed
);

export default router;