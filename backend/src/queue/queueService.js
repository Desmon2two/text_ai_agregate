import { Queue } from "bullmq";
const queue = new Queue("my-queue", {
  connection: {
    host: "0.0.0.0",
    port: 6379,
  },
});
function jobsConstructor(overrides = {}) {
  return {
    name: "myJob",
    payload: {},
    options: { removeOnComplete: 500, removeOnFail: 3000 },
    ...overrides,
  };
}
async function addJobToDispatchQueue(name, payload, options) {
  const job = jobsConstructor({
    name: name || "myJob",
    payload: payload || {},
    options: options || {},
  });
  const job1 = await queue.add(job.name, job.payload, job.options);
  return job1;
}
async function disconnectQueue() {
  await queue.close();
  console.log("Queue connection closed");
}
export default { addJobToDispatchQueue, disconnectQueue };
