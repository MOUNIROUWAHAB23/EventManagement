import Notification from '../models/notificationModel.js';

export const getUserNotifications = async (req, res) => {
  const notifications = await Notification.find({
    $or: [
      { userId: req.user.id },
      { userId: null }
    ]
  });
  res.json(notifications);
};

export const sendNotification = async (req, res) => {
  const notification = await Notification.create(req.body);
  res.status(201).json(notification);
};

export const deleteNotification = async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ message: 'Notification deleted' });
};
