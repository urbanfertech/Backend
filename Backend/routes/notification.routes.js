import express from "express";
import {markAllNotificationsRead, markNotificationRead, getNotifications} from "../controllers/notification.controller.js";
import { verifyToken } from "../middlewares/verifytoken.js";

const router = express.Router();

/**
 * Get user notifications
 */
router.get(
  "/",
  verifyToken,
 getNotifications
);

/**
 * Mark single notification as read
 */
router.patch(
  "/:id/read",
  verifyToken,
markNotificationRead
);

/**
 * Mark all notifications as read
 */
router.patch(
  "/read-all",
  verifyToken,
 markAllNotificationsRead
);

export default router;