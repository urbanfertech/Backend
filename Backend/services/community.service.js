import prisma from "../config/prisma.js";
import { redisClient } from "../config/redis.js";

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

  await prisma.like.create({
    data: { userId, postId }
  });

  await redisClient.del("community_feed");
};



export const commentService = async (userId, postId, comment) => {

  const newComment = await prisma.comment.create({
    data: {
      userId,
      postId,
      comment
    }
  });

  await redisClient.del("community_feed");

  return newComment;
};


export const replyService = async (userId, commentId, comment) => {

  const parent = await prisma.comment.findUnique({
    where: { id: commentId }
  });

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