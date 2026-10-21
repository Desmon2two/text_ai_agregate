export default function mapJobToAiRequest(jobRequest) {
    return {
        provider: jobRequest.provider,
        model: jobRequest.model,
        prompt: jobRequest.body.prompt,
        files: jobRequest.files
    };
}
