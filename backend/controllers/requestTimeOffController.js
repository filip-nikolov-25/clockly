import { sendLeaveRequest,getLeaveRequests } from "../models/requestTimeOffModel.js";

export const requestTimeOffController = async (req, res) => {
    const { start_date, end_date, reason } = req.body;

    const user_id = req.user.id; 
    const company_id = req.user.company_id; 

    try {
        const result = await sendLeaveRequest(start_date, end_date, reason,user_id,company_id)
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getTimeOffRequestsController = async (req, res) => { 
    const user_id = req.user.id;
    const company_id = req.user.company_id; 

    try {
        const result = await getLeaveRequests(user_id, company_id); 
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

 }