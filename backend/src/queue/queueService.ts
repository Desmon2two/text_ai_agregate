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
    name: "myJob",
    payload: {},
    options: {
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
      removeOnComplete: 500,
      removeOnFail: 3000,
    },
    ...overrides,
  };
}

async function addJobToDispatchQueue(
  name?: string,
  payload?: {},
  options?: {},
) {
  const job = jobsConstructor({
    name: name || "dispatchJob",
    payload: payload || {},
    options: options || {},
  });
  const dispatchedJob = await dispatchQueue.add(
    job.name,
    job.payload,
    job.options,
  );
  return dispatchedJob;
}
async function addJobToRecoveryQueue(
  name?: string,
  payload?: {},
  options?: {},
) {
  const job = jobsConstructor({
    name: name || "recoveryJob",
    payload: payload || {},
    options: options || {},
  });
  const recoveryJob = await recoveryQueue.add(
    job.name,
    job.payload,
    job.options,
  );
  return recoveryJob;
}
async function disconnectQueue(queue: Queue) {
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
