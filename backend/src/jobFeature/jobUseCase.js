import dbClient from "../database/dbClient";
import { NotFoundError } from "../errors/applicationErrors";
import jobService from "../jobFeature/jobService";
import userService from "../userFeature/userService";
async function processJob(userId, body) {
    await validateJobInput(body);
    const user = await userService.findById(userId);
    if (!user)
        throw new NotFoundError("User not found");
    const jobType = await jobTypeEstimator(body);
    const providerAndModel = await providerAndModelEstimator(body);
    const estimatedCost = finService.estimateCost(jobType);
    await finService.deductCredits(user.userId, estimatedCost);
    const jobId = await jobService.createJob(dbClient, jobType, estimatedCost, user.userId, { provider: providerAndModel.provider, model: providerAndModel.model }, body);
    return jobId;
}
export default {
    processJob,
};
