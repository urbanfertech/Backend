import prisma from "../config/prisma.js";
import { redisClient } from "../config/redis.js";
import { getIO } from "../config/socket.js";
import { createNotification } from "./notification.service.js";

export const   createPostService = async (userId, content, imageUrl) => {

  const post = await prisma.communityPost.create({
    data: {
      userId,
      content,
      imageUrl
    }
  });

  await redisClient.del("community_feed");

  const followers = await prisma.follow.findMany({
    where: { followingId: userId }
  });

  const feedEntries = followers.map(f => ({
    userId: f.followerId,
    postId: post.id
  }));

  if (feedEntries.length)
    await prisma.feed.createMany({ data: feedEntries });

  return post;
};

export const updatePostService = async (userId, postId, content, imageUrl) => {

  const post = await prisma.communityPost.findUnique({
    where: { id: postId }
  });

  if (post.userId !== userId)
    throw new Error("Unauthorized");

  const updated = await prisma.communityPost.update({
    where: { id: postId },
    data: { content, imageUrl }
  });

  await redisClient.del("community_feed");

  return updated;
};


export const getFeedService = async () => {

  const cache = await redisClient.get("community_feed");

  if (cache)
    return JSON.parse(cache);

  const posts = await prisma.communityPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          photo: true,
          city: true
        }
      },
      _count: {
        select: { likes: true, comments: true }
      }
    }
  });

  await redisClient.setEx(
    "community_feed",
    60,
    JSON.stringify(posts)
  );

  return posts;
};


export const likePostService = async (userId, postId) => {
const io = getIO();
  await prisma.like.create({
    data: { userId, postId }
  });
  await createNotification({
  userId: postOwnerId,
  senderId: userId,
  type: "LIKE",
  postId,
  message: "liked your post"
});
io.to(postId).emit("like-updated", {
    postId,
    likesCount
  });

  await redisClient.del("community_feed");
};



export const commentService = async (userId, postId, comment) => {
const io = getIO();
  const newComment = await prisma.comment.create({
    data: {
      userId,
      postId,
      comment
    }
  });
  const postOwnerId = await prisma.communityPost.findUnique({
    where: { id: postId },
    select: { userId: true }
  })
  console.log(postOwnerId);
  await createNotification({
  userId: postOwnerId.userId,
  senderId: userId,
  type: "COMMENT",
  postId,
  message: "commented on your post"
});
  io.to(postId).emit("new-comment", newComment);

  await redisClient.del("community_feed");

  return newComment;
};


export const replyService = async (userId, commentId, comment) => {
const io = getIO();
  const parent = await prisma.comment.findUnique({
    where: { id: commentId }
  });
  await createNotification({
  userId: parentCommentUserId,
  senderId: userId,
  type: "REPLY",
  commentId,
  message: "replied to your comment"
});
io.to(parent.postId).emit("new-reply", reply);
  return prisma.comment.create({
    data: {
      userId,
      postId: parent.postId,
      parentId: commentId,
      comment
    }
  });
};


export const bookmarkService = async (userId, postId) => {

  return prisma.bookmark.create({
    data: { userId, postId }
  });
};

export const followService = async (userId, targetId) => {
await createNotification({
  userId: targetUserId,
  senderId: userId,
  type: "FOLLOW",
  message: "started following you"
});
  return prisma.follow.create({
    data: {
      followerId: userId,
      followingId: targetId
    }
  });
};


export const trendingFeedService = async () => { 
    const posts = await prisma.communityPost.findMany(
        { include: { _count: { select: { likes: true, comments: true } } } }); 
        
        return posts .map(p => { const hours = (Date.now() - new Date(p.createdAt)) / (1000 * 60 * 60); const score = p._count.likes * 3 + p._count.comments * 4 + (1 / (hours + 1)); return { ...p, score }; }) .sort((a, b) => b.score - a.score); };