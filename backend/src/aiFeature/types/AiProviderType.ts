import { AiRequest } from "./AiRequestType.js";
import { AiResponse } from "./AiResponseType.js";

export type AiProvider = (request: AiRequest) => Promise<AiResponse>;
