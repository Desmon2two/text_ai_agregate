import jobService from "../jobFeature/jobService.js";
import type { JobStateTypes } from "../jobFeature/types/JobStateTypes.js";
import type { Job } from "../jobFeature/types/JobTypes.js";
import type { User } from "./types/userType.js";
import userService from "./userService.js";

async function getAllJobsOfUser(
  dbClient: Client,
  user_id: string,
): Promise< {
    user: User;
    jobs: {
        job_id: string;
        state: JobStateTypes;
        data?: unknown;
    }[];
}> {
  const user = await userService.getCurrentUser(dbClient, user_id);
  const jobs = await jobService.getJobsByUser(dbClient, user.user_id);
  return jobs;
}
export default {
  getAllJobsOfUser,
};
