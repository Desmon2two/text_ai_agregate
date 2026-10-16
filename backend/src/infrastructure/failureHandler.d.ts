import { Client } from "pg";
import { AttemptError } from "../errors/AttemptErrorType";
export default function handleFailure(dbClient: Client, attemptId: string, error: AttemptError): Promise<string | null>;
//# sourceMappingURL=failureHandler.d.ts.map