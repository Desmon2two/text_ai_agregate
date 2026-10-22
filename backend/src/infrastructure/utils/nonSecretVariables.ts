const nonSecretVariables = {
  MAX_ATTEMPTS: 2,
  OUTPUT_TOKENS_MULTIPLIER: 2.5,

  getMaxAttempts() {
    return this.MAX_ATTEMPTS;
  },
  getOutputTokensMultiplier(jobType: string) {
    const multipliers = {
      classification: 1.5,
      summary: 4,
      question: 8,
      code: 15,
      largeReport: 20,
    };
    return multipliers[jobType] ?? this.OUTPUT_TOKENS_MULTIPLIER;
  },
};
export { nonSecretVariables };
