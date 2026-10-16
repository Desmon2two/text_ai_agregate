class ApplicationError extends Error {
    statusCode;
    constructor(message, statusCode, errorType) {
        super(message);
        this.statusCode = statusCode;
        this.name = errorType;
    }
}
class ForbiddenError extends ApplicationError {
    constructor(message) {
        super(message, 403, "ForbiddenError");
    }
}
class ValidationError extends ApplicationError {
    constructor(message) {
        super(message, 400, "ValidationError");
    }
}
class UnauthorizedError extends ApplicationError {
    constructor(message) {
        super(message, 401, "UnauthorizedError");
    }
}
class NotFoundError extends ApplicationError {
    constructor(message) {
        super(message, 404, "NotFoundError");
    }
}
export { ApplicationError, ForbiddenError, ValidationError, UnauthorizedError, NotFoundError, };
//# sourceMappingURL=applicationErrors.js.map