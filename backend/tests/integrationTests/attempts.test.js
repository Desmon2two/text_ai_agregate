import attemptRepository from "../../src/jobFeature/attemptRepository.js";
import { disconnectDB, setupDB } from "../../src/database/dbClient.js";
import { createTestAttempt, createTestJob } from "../helpers/factoryFunctions.js";
let dbClient;
beforeAll(async () => {
    dbClient = await setupDB();
});
afterAll(async () => {
    await disconnectDB(dbClient);
});
beforeEach(async () => {
    dbClient.exec("BEGIN");
});
afterEach(async () => {
    dbClient.exec("ROLLBACK");
});
describe("Testing attempt repository", () => {
    const { job_id } = createTestJob();
    it(" Should create attempts", async () => {
        const { attempt_number, provider, model } = createTestAttempt();
        const result = await attemptRepository.createAttempt(dbClient, job_id, attempt_number, provider, 'gemma3');
        expect(result?.attempt_id).not.toBeNull();
    });
    it("Should delete attempts", async () => {
        const { job_id, attempt_number, provider, model } = createTestAttempt();
        const attempt = await attemptRepository.createAttempt(dbClient, job_id, attempt_number, provider, model);
        const res = await attemptRepository.deleteAttempt(dbClient, attempt.attempt_id);
        expect(res).toBe(0);
    });
    it("Should process attempts", async () => {
        const attempt = createTestAttempt({
            data: {
                tokens: { input_tokens: 5, output_tokens: 12 },
                received_data: "actually something",
                validated_data: "somethingElse"
            },
        });
        const testAttempt = await attemptRepository.createAttempt(dbClient, job_id, attempt.attempt_number, attempt.provider, attempt.model);
        if (testAttempt === null)
            throw new Error("No attempt was created");
        const sending = await attemptRepository.markSending(dbClient, testAttempt?.attempt_id);
        if (sending === null)
            throw new Error("No sending");
        const received = await attemptRepository.markReceived(dbClient, testAttempt?.attempt_id, attempt.data);
        if (received === null)
            throw new Error("No received");
        const validated = await attemptRepository.markValidated(dbClient, testAttempt?.attempt_id, attempt.data);
        if (validated === null)
            throw new Error("No validated");
        const result = await attemptRepository.markCompleted(dbClient, testAttempt?.attempt_id);
        if (result === null)
            throw new Error("No result");
        expect(result?.data?.validated_data).toBe("somethingElse");
    });
    it("Should not allow invalid state transitions", async () => {
        const attempt = createTestAttempt({
            state: "COMPLETED",
            data: {
                tokens: { input_tokens: 5, output_tokens: 12 },
                received_data: "actually something",
            },
        });
        const testAttempt = await attemptRepository.createAttempt(dbClient, attempt.job_id, attempt.attempt_number, attempt.provider, attempt.model);
        const res = await attemptRepository.markCompleted(dbClient, testAttempt.attempt_id);
        expect(res).toBeNull();
    });
});
