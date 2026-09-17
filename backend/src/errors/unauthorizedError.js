import { ApplicationError } from "./applicationError.js";

class UnauthorizedError extends ApplicationError {
	constructor(message) {
		super(message, 401, "UnauthorizedError");
	}
}
export { UnauthorizedError };
