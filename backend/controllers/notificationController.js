import {
  getNotificationsByUserModel,
  getNotificationsForAdminModel,
  updateStatusNotificationModel,
} from "../models/notificationModel.js";

export const getNotificationsByUserController = async (req, res) => {
  const user_id = req.user.id;

  console.log(user_id, "USER ID BEFORE SENDIng");
  try {
    const notification = await getNotificationsByUserModel(user_id);
    return res.json(notification);
  } catch (error) {
    console.error(error);
  }
};

export const updateStatusNotificationController = async (req, res) => {
  const user_id = req.user.id;
  try {
    const notification = await updateStatusNotificationModel(user_id);
    return res.json(notification);
  } catch (error) {
    console.error(error);
  }
};

export const getNotificationsForAdminController = async (req, res) => {
  const company_id = req.user.company_id;
  try {
    const notifications = await getNotificationsForAdminModel(company_id);
    return res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
  }
};
