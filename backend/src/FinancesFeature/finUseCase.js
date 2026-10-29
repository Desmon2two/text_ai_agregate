import { ForbiddenError, NotFoundError, ValidationError } from "../errors/applicationErrors.js";
import jobRepository from "../jobFeature/jobRepository.js";
import finService from "./finService.js";
async function changeCreditsOnJobCompletion(dbClient, job_id) {
    if (!job_id || job_id == "")
        throw new ValidationError("Invalid job_id input");
    const job = await jobRepository.getJobById(dbClient, job_id);
    if (!job)
        throw new NotFoundError("No such job");
    if (job.state !== "COMPLETED")
        throw new ForbiddenError("Can't process incomplete job");
    if (!job.estimated_cost)
        throw new ForbiddenError("No estimated cost on a completed job");
    if (!job.actual_cost)
        throw new ForbiddenError("No actual cost on a completed job");
    const { estimated_cost, actual_cost, user_id } = job;
    if (estimated_cost == actual_cost)
        return;
    const difference = estimated_cost - actual_cost;
    if (difference > 0) {
        const { fin_log_id } = await finService.addCredits(dbClient, user_id, difference, "CREDITS_REFUND_ON_JOB_COMPLETION");
        return { difference, fin_log_id };
    }
    if (difference < 0) {
        const { fin_log_id } = await finService.deductCredits(dbClient, user_id, difference, "CREDITS_DEDUCTION_ON_JOB_COMPLETION");
        return { difference, fin_log_id };
    }
}
export default {
    changeCreditsOnJobCompletion,
};
