import { getNotificationsByUserModel } from "../models/notificationModel.js";

export const getNotificationsByUserController = async (req,res) => {
        const user_id = req.user.id;

     console.log(user_id,"USER ID BEFORE SENDIng")
    try {
        const notification = await getNotificationsByUserModel(user_id)
            res.json(notification)
    } catch (error) {
        console.error(error)
    }
}