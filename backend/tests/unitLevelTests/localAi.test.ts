import localAiService from "../../src/aiFeature/aiServices/localAiService.js";
import {estimateInputAndOutputTokens} from "../../src/infrastructure/utils/tokensEstimator.js"

describe("Local model test", () => {
  it(" Should accept inputs and return answers", async () => {
    const prompt = "How to write a simple buble sorting algorithm?";
    const result = await localAiService.acceptJob(prompt);
    console.log("Estimated:", estimateInputAndOutputTokens(prompt, "code"));
    console.log(result)
    expect(result).not.toBeNull();
  }, 120000);
});
