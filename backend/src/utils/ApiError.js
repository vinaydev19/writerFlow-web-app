export class ApiError extends Error {
    constructor(statusCode, message = "something want wrong", errors = [], stack = "") {
        super(message)

        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.success = false;
        this.data = null;

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
