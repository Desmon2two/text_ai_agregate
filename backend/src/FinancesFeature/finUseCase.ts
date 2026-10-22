import eventRepository from "../jobFeature/eventRepository.js";
import jobRepository from "../jobFeature/jobRepository.js";
import finRepository from "./finRepository.js";

async function changeCreditsOnJobCompletion(dbClient: Client, job_id: string) {
  const job = await jobRepository.getJob(dbClient, job_id);
  if (job === null) throw new Error("No such job");
  if (!job.estimated_cost)
    throw new Error("No estimated cost on a completed job");
  if (!job.actual_cost) throw new Error("No actual cost on a completed job");
  const { estimated_cost, actual_cost, user_id } = job;
  if (estimated_cost == actual_cost) return;
  const difference = estimated_cost - actual_cost;
  if (difference > 0) {
    await finRepository.addCredits(dbClient, user_id, difference);
    await eventRepository.createCreditsAddedEvent(dbClient, user_id, {
      reason: "REFUND_ON_JOB_COMPLETION",
      amount: difference,
    });
  }
  if (difference < 0) {
    await finRepository.deductCredits(dbClient, user_id, difference);
    await eventRepository.createCreditsDeductedEvent(dbClient, user_id, {
      reason: "DEDUCT_ON_JOB_COMPLETION",
      amount: difference,
    });
  }
}
export default {
  changeCreditsOnJobCompletion,
};
