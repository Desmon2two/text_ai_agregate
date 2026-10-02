export default async function markAttemptAndJobFailed(
  dbClient,
  attemptId: number,
  jobId: string,
): Promise<void> {
  await dbClient.query("BEGIN");
  try {
    await attemptRepository.markFailed(dbClient, attemptId);
    await jobRepository.markFailed(dbClient, jobId);
    await dbClient.query("COMMIT");
  } catch (error) {
    await dbClient.query("ROLLBACK");
    throw error;
  } finally {
    await dbClient.end();
  }
}
