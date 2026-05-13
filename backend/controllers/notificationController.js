import {
  getNotificationsForAdminModel,
  getNotificationsForEmployeeModel,
  updateEmployeeNotificationsStatusModel,
  updateStatusNotificationModel,
} from "../models/notificationModel.js";

export const getNotificationsForAdminController = async (req, res) => {
  const user_id = req.user.id;
  const role = req.user.role;
  const company_id = req.user.company_id;
  const offSet = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const notifications = await getNotificationsForAdminModel({
      role,
      user_id,
      company_id,
      offSet,
      limit,
    });

    return res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
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

export const getEmployeeNotificationsController = async (req, res) => {
  const user_id = req.user.id;
  const company_id = req.user.company_id;
  const offSet = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const notifications = await getNotificationsForEmployeeModel({
      user_id,
      company_id,
      offSet,
      limit,
    });
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const markEmployeeNotificationsReadController = async (req, res) => {
  const user_id = req.user.id;
  const company_id = req.user.company_id;

  try {
    const updated = await updateEmployeeNotificationsStatusModel(
      user_id,
      company_id,
    );
    res.json({ updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
