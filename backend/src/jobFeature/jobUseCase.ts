import { NotFoundError } from "../errors/applicationErrors.js";
import jobService from "../jobFeature/jobService.js";
import userService from "../userFeature/userService.js";

async function processJob(dbClient: Client, userId: string, body: unknown) {
  await validateJobInput(body);
  const user = await userService.findById(userId);
  if (!user) throw new NotFoundError("User not found");
  const jobType = await jobTypeEstimator(body);
  const providerAndModel = await providerAndModelEstimator(body);
  const estimatedCost = finService.estimateCost(jobType);
  await finService.deductCredits(user.userId, estimatedCost);
  const jobId = await jobService.createJob(
    dbClient,
    jobType,
    estimatedCost,
    user.userId,
    { provider: providerAndModel.provider, model: providerAndModel.model },
    body,
  );
  return jobId;
}

export default {
  processJob,
};
