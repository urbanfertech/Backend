import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

let io;

export const initSocket = async (server) => {
  io = new Server(server, {
    cors: { origin: "*" }
  });

  const pubClient = createClient({ url: process.env.REDIS_URL });
  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-post", (postId) => {
      socket.join(postId);
    });
    socket.on("join-user", (userId) => {
      socket.join(userId);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};