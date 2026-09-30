import { AiRequest } from "../../aiFeature/types/AiRequestType";
import { CommitJobInput } from "../../jobFeature/types/JobTypes";

export default function mapJobToAiRequest(jobRequest: CommitJobInput): AiRequest{
    return {
        provider: jobRequest.provider, 
        model: jobRequest.model,
        prompt: jobRequest.body.prompt,
        files: jobRequest.files
    }
}