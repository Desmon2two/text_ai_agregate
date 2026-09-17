class ApplicationError extends Error {
	constructor(message, statusCode, errorType) {
		super(message);
		this.name = errorType;
		this.statusCode = statusCode;
	}
}
export { ApplicationError };
