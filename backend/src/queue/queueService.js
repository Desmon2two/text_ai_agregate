import { Queue } from "bullmq";
import { nonSecretVariables } from "../infrastructure/utils/nonSecretVariables";
export const connection = {
    host: "0.0.0.0",
    port: 6379,
};
const dispatchQueue = new Queue("dispatchQueue", {
    connection,
});
const recoveryQueue = new Queue("recoveryQueue", {
    connection,
});
dispatchQueue.setGlobalConcurrency(nonSecretVariables.getGlobalConcurrency());
recoveryQueue.setGlobalConcurrency(nonSecretVariables.getGlobalConcurrency());
function jobsConstructor(overrides = {}) {
    return {
        payload: {},
        name: "myJob",
        options: {
            attempts: 3,
            backoff: { type: "exponential", delay: 1000 },
            removeOnComplete: 500,
            removeOnFail: 3000,
        },
        ...overrides,
    };
}
async function addJobToDispatchQueue(payload, name, options) {
    const job = jobsConstructor({
        payload: payload || {},
        name: name || "dispatchJob",
        options: options || {},
    });
    const dispatchedJob = await dispatchQueue.add(job.name, job.payload, job.options);
    return dispatchedJob;
}
async function addJobToRecoveryQueue(payload, name, options) {
    const job = jobsConstructor({
        payload: payload || {},
        name: name || "recoveryJob",
        options: options || {},
    });
    const recoveryJob = await recoveryQueue.add(job.name, job.payload, job.options);
    return recoveryJob;
}
async function disconnectQueue(queue) {
    await queue.close();
    console.log("Queue connection closed");
}
export default {
    dispatchQueue,
    recoveryQueue,
    addJobToDispatchQueue,
    addJobToRecoveryQueue,
    disconnectQueue,
};
