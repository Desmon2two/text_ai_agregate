import { ApplicationError } from "../errors/applicationError.js";
import { ForbiddenError } from "../errors/forbiddenError.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { UnauthorizedError } from "../errors/unauthorizedError.js";
import { ValidationError } from "../errors/validationError.js";

function errorHandler(err, req, res, next) {
	if (err instanceof ApplicationError)
		return res.status(err.statusCode).json({ message: err.message });
	console.error(err);
	return res.status(500).json({ message: "Internal server error" });
}

export default errorHandler;
