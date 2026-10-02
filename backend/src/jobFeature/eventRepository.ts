async function createEvent(
  dbClient,
  state,
  attemptId,
  metadata,
  error,
): Promise<void> {
  try {
    await dbClient.query(
      `INSERT INTO events (attempt_id, state_name, metadata, error) VALUES ("${attemptId}", ${state}", "${metadata}", "${error}")`,
    );
  } catch (error) {
    throw new Error("Error during event creation");
  }
}
export default {
  createEvent,
};
