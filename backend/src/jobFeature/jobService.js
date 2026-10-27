import jobRepository from "./jobRepository.js";
import eventRepository from "./eventRepository.js";
async function createJob(dbClient, type, estimated_cost, user_id, body, filesUrl) {
    const job = await jobRepository.createJob(dbClient, user_id, type, body, estimated_cost);
    if (job === null)
        throw new Error("Job was not created");
    await eventRepository.createJobAcceptedEvent(dbClient, job.job_id);
    return job;
}
async function markQueued(dbClient, job_id) {
    const job = await jobRepository.markQueued(dbClient, job_id);
    if (job === null) {
        throw new Error("Job was not marked queued");
    }
    await eventRepository.createJobQueuedEvent(dbClient, job_id);
    return job.job_id;
}
async function markProcessing(dbClient, job_id) {
    const job = await jobRepository.markProcessing(dbClient, job_id);
    if (job === null) {
        throw new Error("Job was not marked processing");
    }
    await eventRepository.createJobProcessingEvent(dbClient, job_id);
    return job.job_id;
}
async function completeJob(dbClient, job_id, validated_data, fullPrice) {
    const jobResult = await jobRepository.markCompleted(dbClient, job_id, validated_data, fullPrice);
    if (jobResult === null)
        throw Error("Complete job operation failed at mark job completed");
    await eventRepository.createJobCompletedEvent(dbClient, job_id);
    return jobResult;
}
export default {
    createJob,
    markProcessing,
    markQueued,
    completeJob,
};
