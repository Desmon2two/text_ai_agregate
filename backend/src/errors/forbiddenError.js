import { ApplicationError } from "./applicationError.js";

class ForbiddenError extends ApplicationError {
	constructor(message) {
		super(message, 403, "ForbiddenError");
	}
}

export { ForbiddenError };
