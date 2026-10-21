import type { AiRequest } from "../../aiFeature/types/AiRequestType.js";
import type { CommitJobInput } from "../../jobFeature/types/JobTypes.js";

export default function mapJobToAiRequest(jobRequest: CommitJobInput): AiRequest{
    return {
        provider: jobRequest.provider, 
        model: jobRequest.model,
        prompt: jobRequest.body.prompt,
        files: jobRequest.files
    }
}