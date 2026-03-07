import rateLimit from "express-rate-limit";

export const postLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max requests per user
  message: {
    status: false,
    message: "Too many requests, please try again later"
  }
});