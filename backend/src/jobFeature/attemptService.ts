import { dbClient } from "../database/dbClient";
import { Attempt, CreateAttemptInput } from "./types/AttemptTypes";

async function createAttempt({
  jobId,
  provider,
  model,
}: CreateAttemptInput): Promise<Attempt> {
  await dbClient.query("BEGIN");
  try {
    let attempts = await attemptRepository.attemptsByJobId(jobId);
    if (attempts >= process.env.MAX_ATTEMPTS) {
      throw new Error("Too many attempts for this job");
    }
    const attempt = await attemptRepository.create({
      dbClient,
      jobId,
      attemptNumber: attempts + 1,
      provider,
      model,
    });
    await dbClient.query("COMMIT");
    return attempt;
  } catch (error) {
    await dbClient.query("ROLLBACK");
    throw error;
  } 
}
async function completeAttempt(attemptId: string): Promise<string | null>{

}
async function failAttempt(attemptId: string): Promise<string | null> {
  const failedAttempt = await attemptRepository.findById(attemptId);
  if (!failedAttempt) throw new Error("Attempt not found");
  await dbClient.query("BEGIN");
  try {
    await attemptRepository.markFailed(dbClient, attemptId);
    let attempts = await attemptRepository.attemptsByJobId(dbClient, jobId);
    if (attempts >= process.env.MAX_ATTEMPTS) {
      await dbClient.query("COMMIT");
      return null;
    }
    const retry = await createAttempt({
      dbClient,
      jobId: failedAttempt.jobId,
      provider: failedAttempt.provider,
      model: failedAttempt.model,
    });

    await dbClient.query("COMMIT");
    return retry.attemptId;
  } catch (error) {
    await dbClient.query("ROLLBACK");
    throw error;
  } 
}
export default {
  createAttempt,
  completeAttempt,
  failAttempt,
};
