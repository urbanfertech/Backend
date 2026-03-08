import prisma from "../config/prisma.js";
import { getIO } from "../config/socket.js";

export const createNotification = async ({
  userId,
  senderId,
  type,
  postId = null,
  commentId = null,
  message
}) => {
   if(userId === senderId) return;
  const notification = await prisma.notification.create({
    data: {
      userId,
      senderId,
      type,
      postId,
      commentId,
      message
    }
  });

  const io = getIO();

  io.to(userId).emit("new-notification", notification);

  return notification;
};