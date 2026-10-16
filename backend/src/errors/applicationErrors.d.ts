declare class ApplicationError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number, errorType: string);
}
export type AttemptError = {
    message: string;
    retryable: boolean;
    provider?: string;
    code?: string;
};
declare class ForbiddenError extends ApplicationError {
    constructor(message: string);
}
declare class ValidationError extends ApplicationError {
    constructor(message: string);
}
declare class UnauthorizedError extends ApplicationError {
    constructor(message: string);
}
declare class NotFoundError extends ApplicationError {
    constructor(message: string);
}
export { ApplicationError, ForbiddenError, ValidationError, UnauthorizedError, NotFoundError, };
//# sourceMappingURL=applicationErrors.d.ts.map