import jobRepository from "../jobFeature/jobRepository.js";
import finService from "./finService.js";
async function changeCreditsOnJobCompletion(dbClient: Client, job_id: string) {
  if (!job_id || job_id == "") throw new Error("Invalid job_id input");
  const job = await jobRepository.getJobById(dbClient, job_id);
  if (!job) throw new Error("No such job");
  if (job.state !== "COMPLETED")
    throw new Error("Can't process incomplete job");
  if (!job.estimated_cost)
    throw new Error("No estimated cost on a completed job");
  if (!job.actual_cost) throw new Error("No actual cost on a completed job");
  const { estimated_cost, actual_cost, user_id } = job;
  if (estimated_cost == actual_cost) return;
  const difference = estimated_cost - actual_cost;
  if (difference > 0) {
    const { fin_log_id } = await finService.addCredits(
      dbClient,
      user_id,
      difference,
      "CREDITS_REFUND_ON_JOB_COMPLETION",
    );

    return { difference, fin_log_id };
  }
  if (difference < 0) {
    const { fin_log_id } = await finService.deductCredits(
      dbClient,
      user_id,
      difference,
      "CREDITS_DEDUCTION_ON_JOB_COMPLETION",
    );
    return { difference, fin_log_id };
  }
}
export default {
  changeCreditsOnJobCompletion,
};
