export abstract class CustomError extends Error {
    private context: object;

    constructor(message: string, context: object) {
        super(message);
        this.context = context;
        Error.captureStackTrace(this, this.constructor);
    }
}
