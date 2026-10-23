import { estimateInputAndOutputTokens } from "../infrastructure/utils/tokensEstimator.js";
import userRepository from "../userFeature/userRepository.js";

import finRepository from "./finRepository.js";

async function estimateCost(
  dbClient: Client,
  prompt: string,
  job_type: string,
  model: string,
) {
  if (!prompt || !job_type || !model) {
    throw new Error("Invalid input: should not be null or undefined or empty");
  }
  const { inputTokens, outputTokens } = estimateInputAndOutputTokens(
    prompt,
    job_type,
  );
  const { input_price_for_1m_tokens, output_price_for_1m_tokens } =
    await finRepository.getCostOfModel(dbClient, model);
  const inputPrice = inputTokens * (input_price_for_1m_tokens / 1000000);
  const outputPrice = outputTokens * (output_price_for_1m_tokens / 1000000);
  const fullPrice = inputPrice + outputPrice;
  return { fullPrice, inputPrice, outputPrice };
}
async function mapTokensToActualCost(
  dbClient: Client,
  model: string,
  inputTokens: number,
  outputTokens?: number,
) {
  const { input_price_for_1m_tokens, output_price_for_1m_tokens } =
    await finRepository.getCostOfModel(dbClient, model);
  const inputPrice = inputTokens * (input_price_for_1m_tokens / 1000000);
  if (!outputTokens) return inputPrice;
  const outputPrice = outputTokens * (output_price_for_1m_tokens / 1000000);
  const fullPrice = inputPrice + outputPrice;
  return { fullPrice, inputPrice, outputPrice };
}
async function reserveCredits(
  dbClient: Client,
  user_id: string,
  estimated_cost: number,
) {
  const user = await userRepository.getUserById(dbClient, user_id);
  if (user === null) throw new Error("No user");
  if (user.credits < 0) throw new Error("Negative credits");
  if ((user.credits = 0)) throw new Error("Not enough credits");

  if (user.credits <= estimated_cost)
    throw new Error("Insufficient credits for job");
  const deducted = await finRepository.deductCredits(
    dbClient,
    user_id,
    estimated_cost,
  );
  if (deducted === null) throw new Error("Error during credits reservation");
}

export { estimateCost, mapTokensToActualCost, reserveCredits };
