import { ApplicationError } from "./applicationError.js";

class NotFoundError extends ApplicationError {
	constructor(message) {
		super(message, 404, "NotFoundError");
	}
}
export { NotFoundError };
