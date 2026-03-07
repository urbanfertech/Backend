import * as service from "../services/community.service.js";
export const createPost = async (req, res) => {
  try {
    if(!req.body) return res.status(400).json({ success: false, message: "No data provided" });
    const { content, imageUrl } = req.body;

    const post = await service.createPostService(
      req.user.id,
      content,
      imageUrl
    );

    return res.status(201).json({
      status: true,
      message: "Post created successfully",
      data: post
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to create post"
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await service.updatePostService(
      req.user.id,
      req.params.postId,
      req.body.content,
      req.body.imageUrl
    );

    return res.json({
      status: true,
      message: "Post updated successfully",
      data: post
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to update post"
    });
  }
};

export const getFeed = async (req, res) => {
  try {
    const feed = await service.getFeedService();
     
    return res.json({
      status: true,
      message: "Feed fetched successfully",
      data: feed
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to fetch feed"
    });
  }
};

export const likePost = async (req, res) => {
  try {
    await service.likePostService(
      req.user.id,
      req.params.postId
    );

    return res.json({
      status: true,
      message: "Post liked successfully"
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to like post"
    });
  }
};

export const commentPost = async (req, res) => {
  try {
    const comment = await service.commentService(
      req.user.id,
      req.params.postId,
      req.body.comment
    );

    return res.json({
      status: true,
      message: "Comment added successfully",
      data: comment
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to add comment"
    });
  }
};

export const replyComment = async (req, res) => {
  try {
    const reply = await service.replyService(
      req.user.id,
      req.params.commentId,
      req.body.comment
    );

    return res.json({
      status: true,
      message: "Reply added successfully",
      data: reply
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to add reply"
    });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const bookmark = await service.bookmarkService(
      req.user.id,
      req.params.postId
    );

    return res.json({
      status: true,
      message: "Post bookmarked successfully",
      data: bookmark
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to bookmark post"
    });
  }
};

export const followUser = async (req, res) => {
  try {
    if(req.user.id === req.params.userId) return res.status(400).json({ status: false, message: "You cannot follow yourself" });
    const follow = await service.followService(
      req.user.id,
      req.params.userId
    );

    return res.json({
      status: true,
      message: "User followed successfully",
      data: follow
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to follow user"
    });
  }
};

export const getTrendingFeed = async (req, res) => {
  try {
    const posts = await service.trendingFeedService();

    return res.json({
      status: true,
      message: "Trending feed fetched successfully",
      data: posts
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};