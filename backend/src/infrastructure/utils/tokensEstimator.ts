import { nonSecretVariables } from "./nonSecretVariables.js";

export function estimateInputAndOutputTokens(
  inputText: string,
  jobType: string,
) {
  // A GROSS APPROXIMATION!!!!
  const inputTokens = Math.ceil(inputText.length / 2);
  const outputTokens =
    inputTokens * nonSecretVariables.getOutputTokensMultiplier(jobType);
  return { inputTokens, outputTokens };
}
