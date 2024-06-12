import { getFeedbacks, getFeedbacksByAdminId, getFeedbacksByUserId } from "$lib/models/feedback";

/**
 * HistoryRepo class
 * @class
 * @classdesc HistoryRepo class to handle history data
 */
export class FeedBackRepo {
    /**
     * @constructs FeedBackRepo
     * @param {Array<import("$lib/models/feedback").FeedBack>} feedbacks - Array of feedbacks
     * @param {"user"|"self"|"admin"} usertype - Type of user
     */
    constructor(feedbacks = [], usertype) {
        this.datas = feedbacks.map((feedback) => {
            let data = {};
            let action = {};
            if (usertype == "user") {
                action = feedback.status == "closed" ? {
                    view: "/feedback/form?id=" + feedback.id,
                } : {
                    view: "/feedback/form?id=" + feedback.id,
                    edit: "/feedback/form?id=" + feedback.id + "&edit=true",
                };
                data = {
                    id: feedback.id,
                    date: feedback.date,
                    content: feedback.content,
                    status: feedback.status,
                    action
                }
            } else {
                action = feedback.status == "closed" ? {
                    view: "/manage/feedback/form?id=" + feedback.id + "&view=true",
                } : {
                    view: "/manage/feedback/form?id=" + feedback.id + "&view=true",
                    reply: "/manage/feedback/form?id=" + feedback.id + "&edit=true",
                }
                data = {
                    id: feedback.id,
                    user_id: feedback.user_id,
                    date: feedback.date,
                    content: feedback.content,
                    status: feedback.status,
                    action
                }
            }
            return data;
        });
    }
    static async getUserFeedback(userId) {
        let feedbacks = await getFeedbacksByUserId(userId);
        return new FeedBackRepo(feedbacks, "user").datas;
    }

    static async getAdminFeedback(adminId) {
        let feedbacks = await getFeedbacksByAdminId(adminId);
        return new FeedBackRepo(feedbacks, "self").datas;
    }

    static async getFeedbacks() {
        let feedbacks = await getFeedbacks();
        return new FeedBackRepo(feedbacks, "admin").datas;
    }
}