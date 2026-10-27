import type { JobTypes } from "../../jobFeature/types/JobTypes";

export const nonSecretVariables = {
  MAX_ATTEMPTS: 2,
  OUTPUT_TOKENS_MULTIPLIER: 2.5,
  GLOBAL_CONCURRENCY_SETTING: 1,
  PROJECT_STATE: "test",

  getMaxAttempts() {
    return this.MAX_ATTEMPTS;
  },
  getOutputTokensMultiplier(jobType: JobTypes) {
    const multipliers = {
      CLASSIFICATION: 1.5,
      SUMMARY: 4,
      QUESTION: 8,
      CODE: 15,
      LARGE_REPORT: 20,
    };
    return multipliers[jobType] ?? this.OUTPUT_TOKENS_MULTIPLIER;
  },
  getGlobalConcurrency() {
    return this.GLOBAL_CONCURRENCY_SETTING;
  },
  getProjectState() {
    return this.PROJECT_STATE;
  },
};
