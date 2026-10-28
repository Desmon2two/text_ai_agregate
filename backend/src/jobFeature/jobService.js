import jobRepository from "./jobRepository.js";
import eventRepository from "./eventRepository.js";
async function createJob(dbClient, user_id, type, body, estimated_cost, filesUrl) {
    const job = await jobRepository.createJob(dbClient, user_id, type, body, estimated_cost);
    if (job?.state !== "CREATED")
        throw new Error("Job not in 'CREATED' state");
    if (job === null)
        throw new Error("Job was not created");
    await eventRepository.createJobAcceptedEvent(dbClient, job.job_id);
    return job;
}
async function markAccepted(dbClient, job_id) {
    const job = await jobRepository.getJobById(dbClient, job_id);
    if (job?.state !== "CREATED")
        throw new Error("Job not in 'CREATED' state to transition to 'ACCEPTED' state");
    const result = await jobRepository.markAccepted(dbClient, job_id);
    if (result === null) {
        throw new Error("Job was not marked accepted");
    }
    await eventRepository.createJobAcceptedEvent(dbClient, job_id);
    return result.job_id;
}
async function markQueued(dbClient, job_id) {
    const job = await jobRepository.getJobById(dbClient, job_id);
    if (job?.state !== "ACCEPTED")
        throw new Error("Job not in 'ACCEPTED' state to transition to 'QUEUED' state");
    const result = await jobRepository.markQueued(dbClient, job_id);
    if (result === null) {
        throw new Error("Job was not marked queued");
    }
    await eventRepository.createJobQueuedEvent(dbClient, job_id);
    return result.job_id;
}
async function markProcessing(dbClient, job_id) {
    const job = await jobRepository.getJobById(dbClient, job_id);
    if (job?.state !== "QUEUED")
        throw new Error("Job not in 'QUEUED' state to transition to 'PROCESSING' state");
    const result = await jobRepository.markProcessing(dbClient, job_id);
    if (result === null) {
        throw new Error("Job was not marked processing");
    }
    await eventRepository.createJobProcessingEvent(dbClient, job_id);
    return result.job_id;
}
async function completeJob(dbClient, job_id, validated_data, fullPrice) {
    const job = await jobRepository.getJobById(dbClient, job_id);
    if (job?.state !== "PROCESSING")
        throw new Error("Job not in 'PROCESSING' state to transition to 'COMPLETED' state");
    const jobResult = await jobRepository.markCompleted(dbClient, job_id, validated_data, fullPrice);
    if (jobResult === null)
        throw Error("Complete job operation failed at mark job completed");
    await eventRepository.createJobCompletedEvent(dbClient, job_id);
    return jobResult;
}
async function failJob(dbClient, job_id, reason) {
    const job = await jobRepository.getJobById(dbClient, job_id);
    if (job?.state === "COMPLETED")
        throw new Error("Job in 'COMPLETED' state and can't be transitioned to 'FAILED' state");
    const jobResult = await jobRepository.markCompleted(dbClient, job_id, validated_data, fullPrice);
    if (jobResult === null)
        throw Error("Complete job operation failed at mark job completed");
    await eventRepository.createJobFailedEvent(dbClient, job_id, {
        error: reason,
    });
    return jobResult;
}
export default {
    createJob,
    markAccepted,
    markProcessing,
    markQueued,
    completeJob,
    failJob,
};
