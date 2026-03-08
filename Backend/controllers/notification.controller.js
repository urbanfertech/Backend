import prisma from "../config/prisma.js";

export const getNotifications = async (req, res) => {
  try {

    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" }
    });

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: notifications
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch notifications",
    });
  }
};

export const markNotificationRead = async (req, res) => {
  try {

    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true }
    });

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      
      data: notification
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update notification",
  
    });
  }
};


export const markAllNotificationsRead = async (req, res) => {
  try {

    await prisma.notification.updateMany({
      where: {
        userId: req.user.id,
        isRead: false
      },
      data: { isRead: true }
    });

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update notifications",
    });
  }
};