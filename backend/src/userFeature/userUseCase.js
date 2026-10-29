import jobService from "../jobFeature/jobService.js";
import userService from "./userService.js";
async function getAllJobsOfUser(dbClient, user_id) {
    const user = await userService.getCurrentUser(dbClient, user_id);
    const jobs = await jobService.getJobsByUser(dbClient, user.user_id);
    return jobs;
}
export default {
    getAllJobsOfUser,
};
