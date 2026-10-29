import { ForbiddenError, NotFoundError, ValidationError } from "../errors/applicationErrors.js";
import { estimateInputAndOutputTokens } from "../infrastructure/utils/tokensEstimator.js";
import eventRepository from "../jobFeature/eventRepository.js";
import userRepository from "../userFeature/userRepository.js";

import finRepository from "./finRepository.js";
import { FinLog } from "./types/FinLogType.js";

async function estimateCost(
  dbClient: Client,
  prompt: string,
  job_type: string,
  model: string,
) {
  if (!prompt || !job_type || !model) {
    throw new ValidationError("Invalid input: should not be null or undefined or empty");
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
async function addCredits(
  dbClient: Client,
  user_id: string,
  amount: number,
  reason: string,
): Promise<{ fin_log_id: string }> {
  await finRepository.addCredits(dbClient, user_id, amount);
  await eventRepository.createCreditsAddedEvent(dbClient, user_id, {
    reason,
    amount,
  });
  const { fin_log_id } = await finRepository.createFinLog(
    dbClient,
    user_id,
    amount,
    reason,
  );
  if (!fin_log_id) throw new Error("Fin log was not created");
  return fin_log_id;
}
async function deductCredits(
  dbClient: Client,
  user_id: string,
  amount: number,
  reason: string,
): Promise<{ fin_log_id: string }> {
  await finRepository.deductCredits(dbClient, user_id, amount);
  await eventRepository.createCreditsDeductedEvent(dbClient, user_id, {
    reason,
    amount,
  });
  const deductionAmount = amount * -1;
  const { fin_log_id } = await finRepository.createFinLog(
    dbClient,
    user_id,
    deductionAmount,
    reason,
  );
  if (!fin_log_id) throw new Error("Fin log was not created");
  return fin_log_id;
}
async function getCreditsOfUser(
  dbClient: Client,
  user_id: string,
): Promise<number> {
  const credits = await finRepository.getCreditsOfUser(dbClient, user_id);
  if (!credits) throw new NotFoundError("No such user");
  return credits;
}
async function getFinancialLogOfUser(
  dbClient: Client,
  user_id: string,
): Promise<FinLog[]> {
  const logs = await finRepository.getCreditLogOfUser(dbClient, user_id);
  if (!logs) throw new NotFoundError("No such user or no logs");
  return logs;
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
): Promise<{ fin_log_id: string }> {
  const user = await userRepository.getUserById(dbClient, user_id);
  if (user === null) throw new NotFoundError("No user");
  if (user.credits < 0) throw new ForbiddenError("Negative credits");
  if ((user.credits = 0)) throw new ForbiddenError("Not enough credits");
  if (user.credits <= estimated_cost)
    throw new ForbiddenError("Insufficient credits for job");
  const deducted = await finRepository.deductCredits(
    dbClient,
    user_id,
    estimated_cost,
  );
  if (!deducted) throw new Error("Error during credits reservation");
  const { fin_log_id } = await finRepository.createFinLog(
    dbClient,
    user_id,
    estimated_cost,
    "CREDITS_RESERVATION_FOR_JOB",
  );
  if (!fin_log_id) throw new Error("Fin log was not created");
  await eventRepository.createCreditsDeductedEvent(dbClient, user_id, {
    reason: "CREDITS_RESERVATION_FOR_JOB",
    amount: estimated_cost,
  });
  return fin_log_id;
}

export default {
  addCredits,
  deductCredits,
  estimateCost,
  getCreditsOfUser,
  getFinancialLogOfUser,
  mapTokensToActualCost,
  reserveCredits,
};
