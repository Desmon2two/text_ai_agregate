import { estimateInputAndOutputTokens } from "../infrastructure/utils/tokensEstimator.js";

import finRepository from "./finRepository.js";

async function estimateCost(
  dbClient: Client,
  prompt: string,
  jobType: string,
  model: string,
) {
  const { inputTokens, outputTokens } = estimateInputAndOutputTokens(
    prompt,
    jobType,
  );
  const { input_price_for_1m_tokens, output_price_for_1m_tokens } =
    await finRepository.getCostOfModel(dbClient, model);
  const inputPrice = inputTokens * (input_price_for_1m_tokens / 1000000);
  const outputPrice = outputTokens * (output_price_for_1m_tokens / 1000000);
  const fullPrice = inputPrice + outputPrice;
  return { fullPrice, inputPrice, outputPrice };
}

export default {
  estimateCost,
};
