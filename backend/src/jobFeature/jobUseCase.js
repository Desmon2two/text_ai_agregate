import { NotFoundError } from "../errors/applicationErrors.js";
import { estimateCost, reserveCredits } from "../FinancesFeature/finService.js";
import jobService from "../jobFeature/jobService.js";
import userRepository from "../userFeature/userRepository.js";
async function startJob(dbClient, user_id, provider, model, job_type, body, files) {
    if (!body.prompt)
        throw new Error("No prompt to process job");
    if (body.prompt.length === 0)
        throw new Error("Invalid prompt to process job");
    const user = await userRepository.getUserById(dbClient, user_id);
    if (!user)
        throw new NotFoundError("User not found");
    dbClient.query("BEGIN");
    try {
        const { fullPrice } = await estimateCost(dbClient, body.prompt, job_type, model);
        await reserveCredits(dbClient, user.user_id, fullPrice);
        const job = await jobService.createJob(dbClient, job_type, fullPrice, user.user_id, provider, model, body, files);
        dbClient.query("COMMIT");
        await queueService.enqueue(job.job_id);
        return job.job_id;
    }
    catch (error) {
        dbClient.query("ROLLBACK");
        throw error;
    }
}
export default {
    startJob,
};
