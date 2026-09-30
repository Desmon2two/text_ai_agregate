import { AiRequest } from "./AiRequestType";
import { AiResponse } from "./AiResponseType";

export type AiProvider = (request: AiRequest) => Promise<AiResponse>;
