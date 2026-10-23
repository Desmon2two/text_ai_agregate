const nonSecretVariables = {
    MAX_ATTEMPTS: 2,
    OUTPUT_TOKENS_MULTIPLIER: 2.5,
    getMaxAttempts() {
        return this.MAX_ATTEMPTS;
    },
    getOutputTokensMultiplier(jobType) {
        const multipliers = {
            CLASSIFICATION: 1.5,
            SUMMARY: 4,
            QUESTION: 8,
            CODE: 15,
            LARGE_REPORT: 20,
        };
        return multipliers[jobType] ?? this.OUTPUT_TOKENS_MULTIPLIER;
    },
};
export { nonSecretVariables };
