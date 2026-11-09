function createTestUser(overrides = {}) {
    return {
        user_id: 1,
        username: "testUser",
        email: "tstEmail@example.com",
        password: "exampleUserPassword!!!!",
        credits: 100,
        ...overrides,
    };
}
function createTestJob(overrides = {}) {
    return {
        user_id: 1,
        job_id: 1,
        state: "CREATED",
        type: "QUESTION",
        estimated_cost: 100,
        body: {
            prompt: "Hello!!!",
        },
        ...overrides,
    };
}
function createTestAttempt(overrides = {}) {
    return {
        job_id: 1,
        attempt_id: 1000,
        attempt_number: 1,
        state: "CREATED",
        provider: "local",
        model: "gemma3:1b",
        ...overrides,
    };
}
export { createTestUser, createTestJob, createTestAttempt };
