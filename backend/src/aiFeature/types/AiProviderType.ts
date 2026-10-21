import type { AiRequest } from "./AiRequestType.js";
import type { AiResponse } from "./AiResponseType.js";

export type AiProvider = (request: AiRequest) => Promise<AiResponse>;
