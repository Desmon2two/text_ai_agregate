import { ApplicationError } from "./applicationError.js";

class ValidationError extends ApplicationError {
	constructor(message) {
		super(message, 400, "ValidationError");
	}
}
export { ValidationError };
