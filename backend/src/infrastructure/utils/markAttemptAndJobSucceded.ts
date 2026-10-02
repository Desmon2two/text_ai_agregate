export default async function markAttemptAndJobSucceded(
  dbClient,
  attemptId: number,
  jobId: string,
): Promise<void> {
  await dbClient.query("BEGIN");
  try {
    await attemptRepository.markSucceded(attemptId);
    await jobRepository.markSucceded(jobId);
    await dbClient.query("COMMIT");
  } catch (error) {
    await dbClient.query("ROLLBACK");
    throw error;
  } finally {
	await dbClient.end()
  }
}
