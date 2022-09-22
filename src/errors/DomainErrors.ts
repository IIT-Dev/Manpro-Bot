import { CustomError } from './CustomError';

export class DomainError extends CustomError {
    constructor(message: string, context: object) {
        super(message, context);
    }
}

export class UnrecognizedInstructionError extends DomainError {
    constructor(message: string, context: object) {
        super(message, context);
    }
}

export class RequestError extends CustomError {
    constructor(message: string, context: object) {
        super(message, context);
    }
}
